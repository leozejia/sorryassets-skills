import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = path.join(root, "skills");
const allowedFrontmatter = new Set(["name", "description"]);
const forbiddenContent = /sorryassets\.workflow|instantiate_skill|workflow attachment/i;

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function frontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const data = {};
  for (const line of match[1].split("\n")) {
    if (!line.trim()) continue;
    if (/^\s/.test(line)) throw new Error("nested frontmatter is not supported");
    const field = line.match(/^([a-zA-Z0-9_.-]+):\s*(.*)$/);
    if (!field) throw new Error(`invalid frontmatter line: ${line}`);
    const [, key, rawValue] = field;
    if (!allowedFrontmatter.has(key)) throw new Error(`unsupported frontmatter field: ${key}`);
    if (Object.hasOwn(data, key)) throw new Error(`duplicate frontmatter field: ${key}`);
    data[key] = rawValue.replace(/^"|"$/g, "");
  }
  return data;
}

async function filesUnder(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const item = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(item));
    else if (entry.isFile()) files.push(item);
  }
  return files;
}

async function packageManifest(dir) {
  const files = [];
  for (const file of await filesUnder(dir)) {
    const body = await readFile(file);
    files.push({
      path: path.relative(dir, file).split(path.sep).join("/"),
      bytes: body.length,
      sha256: createHash("sha256").update(body).digest("hex"),
    });
  }
  files.sort((left, right) => {
    const leftPath = left.path.toLowerCase();
    const rightPath = right.path.toLowerCase();
    return leftPath < rightPath ? -1 : leftPath > rightPath ? 1 : 0;
  });
  const canonical = files
    .map((file) => `${file.path}\0${file.bytes}\0${file.sha256}\n`)
    .join("");
  return {
    digest: createHash("sha256").update(canonical).digest("hex"),
    totalBytes: files.reduce((total, file) => total + file.bytes, 0),
    files,
  };
}

const entries = await readdir(skillsDir);
const skillNames = [];
const packageManifests = new Map();

for (const name of entries) {
  const dir = path.join(skillsDir, name);
  if (!(await stat(dir)).isDirectory()) continue;
  skillNames.push(name);
  packageManifests.set(name, await packageManifest(dir));
  const skillPath = path.join(dir, "SKILL.md");
  let markdown;
  try {
    markdown = await readFile(skillPath, "utf8");
  } catch {
    fail(`${name}: missing SKILL.md`);
    continue;
  }

  let meta;
  try {
    meta = frontmatter(markdown);
  } catch (error) {
    fail(`${name}: ${error.message}`);
    continue;
  }
  if (!meta) {
    fail(`${name}: missing YAML frontmatter`);
    continue;
  }
  if (meta.name !== name) fail(`${name}: frontmatter name must match directory`);
  if (!meta.description) fail(`${name}: missing description`);
  if (forbiddenContent.test(markdown)) fail(`${name}: contains private workflow runtime language`);

  for (const file of await filesUnder(dir)) {
    if (path.basename(file) === "sorryassets.workflow.json") {
      fail(`${name}: private workflow attachment is forbidden`);
    }
  }
}

if (skillNames.length === 0) fail("no skills found");

let catalog;
try {
  catalog = JSON.parse(await readFile(path.join(root, "catalog.json"), "utf8"));
} catch (error) {
  fail(`invalid catalog.json: ${error.message}`);
}

if (catalog) {
  const serialized = JSON.stringify(catalog);
  if (serialized.includes("workflowPath") || serialized.includes("sorryassets.workflow")) {
    fail("catalog.json contains a private workflow attachment field");
  }
  const catalogNames = catalog.skills?.map((skill) => skill.name).sort() ?? [];
  const directories = skillNames.sort();
  if (JSON.stringify(catalogNames) !== JSON.stringify(directories)) {
    fail("catalog skills must match package directories exactly");
  }
  const skillKeys = new Set();
  for (const skill of catalog.skills ?? []) {
    if (skill.id !== skill.name || skill.path !== `skills/${skill.name}`) {
      fail(`${skill.name}: id and path must match the package directory`);
    }
    const skillKey = `${catalog.repository}:${skill.id}`;
    if (skillKeys.has(skillKey)) fail(`${skill.name}: duplicate logical key ${skillKey}`);
    skillKeys.add(skillKey);
    if (!new Set(["preview", "live", "coming-soon"]).has(skill.status)) {
      fail(`${skill.name}: invalid catalog status ${skill.status}`);
    }
    const expected = packageManifests.get(skill.name);
    if (JSON.stringify(skill.package) !== JSON.stringify(expected)) {
      fail(`${skill.name}: package manifest does not match files on disk`);
    }
  }
}

if (!process.exitCode) console.log(`Validated ${skillNames.length} standard Skills.`);
