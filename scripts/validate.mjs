import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSkillPackage, filesUnder } from "./package-lib.mjs";

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

const entries = await readdir(skillsDir, { withFileTypes: true });
const skillNames = [];
const packageManifests = new Map();

for (const entry of entries) {
  const name = entry.name;
  const dir = path.join(skillsDir, name);
  if (!entry.isDirectory()) {
    fail(`${name}: package root must be a real directory`);
    continue;
  }
  skillNames.push(name);
  packageManifests.set(name, (await buildSkillPackage(dir)).package);
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
  if (catalog.version !== 2) fail("catalog.json version must be 2");
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
    if (typeof skill.version !== "string" || !/^\d+\.\d+\.\d+$/.test(skill.version)) {
      fail(`${skill.name}: version must be semantic (MAJOR.MINOR.PATCH), got ${skill.version}`);
    }
    const expected = packageManifests.get(skill.name);
    if (JSON.stringify(skill.package) !== JSON.stringify(expected)) {
      fail(`${skill.name}: package manifest does not match files on disk`);
    }
  }
}

if (!process.exitCode) console.log(`Validated ${skillNames.length} standard Skills.`);
