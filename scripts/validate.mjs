import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const skillsDir = path.join(root, "skills");

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function frontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const data = {};
  const lines = match[1].split("\n");
  let current = null;
  for (const line of lines) {
    const top = line.match(/^([a-zA-Z0-9_.-]+):\s*(.*)$/);
    if (top) {
      current = top[1];
      data[current] = top[2].replace(/^"|"$/g, "");
      continue;
    }
    const nested = line.match(/^  ([a-zA-Z0-9_.-]+):\s*(.*)$/);
    if (nested && current) {
      if (typeof data[current] !== "object") data[current] = {};
      data[current][nested[1]] = nested[2].replace(/^"|"$/g, "");
    }
  }
  return data;
}

const entries = await readdir(skillsDir);
let count = 0;

for (const name of entries) {
  const dir = path.join(skillsDir, name);
  if (!(await stat(dir)).isDirectory()) continue;
  count += 1;
  const skillPath = path.join(dir, "SKILL.md");
  let markdown;
  try {
    markdown = await readFile(skillPath, "utf8");
  } catch {
    fail(`${name}: missing SKILL.md`);
    continue;
  }
  const meta = frontmatter(markdown);
  if (!meta) {
    fail(`${name}: missing YAML frontmatter`);
    continue;
  }
  if (meta.name !== name) fail(`${name}: frontmatter name must match directory`);
  if (!meta.description) fail(`${name}: missing description`);
  const workflow = meta.metadata?.["sorryassets.workflow"];
  if (workflow) {
    try {
      JSON.parse(await readFile(path.join(dir, workflow), "utf8"));
    } catch (error) {
      fail(`${name}: invalid sorryassets.workflow ${workflow}: ${error.message}`);
    }
  }
}

if (count === 0) fail("no skills found");
if (!process.exitCode) console.log(`Validated ${count} skills.`);
