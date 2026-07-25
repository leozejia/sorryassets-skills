#!/usr/bin/env node
// Copy canonical shared references from _shared/ into each product-type Skill's
// references/ tree. Skills are self-contained and independently installable, so
// shared craft/stages/styles/models are duplicated per package rather than
// referenced across packages (see ARCHITECTURE.md — Self-Contained Over DRY).
//
// Usage:
//   node scripts/sync-references.mjs          copy _shared into every skill
//   node scripts/sync-references.mjs --check   fail if any copy has drifted
//
// Each skill declares which shared groups it consumes in references/.sync.json:
//   { "craft": ["cinematography.md", "defects.md"], "styles": ["pixar.md"], ... }

import { readFile, writeFile, readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sharedDir = path.join(root, "_shared");
const skillsDir = path.join(root, "skills");
const check = process.argv.includes("--check");

const exists = async (p) => { try { await stat(p); return true; } catch { return false; } };

async function readManifest(skillDir) {
  const manifestPath = path.join(skillDir, "references", ".sync.json");
  if (!(await exists(manifestPath))) return null;
  return JSON.parse(await readFile(manifestPath, "utf8"));
}

let drift = 0;
let copied = 0;
const skills = (await readdir(skillsDir, { withFileTypes: true }))
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

for (const skill of skills) {
  const skillDir = path.join(skillsDir, skill);
  const manifest = await readManifest(skillDir);
  if (!manifest) continue;

  for (const [group, files] of Object.entries(manifest)) {
    for (const file of files) {
      const src = path.join(sharedDir, group, file);
      const dest = path.join(skillDir, "references", group, file);
      if (!(await exists(src))) {
        console.error(`missing canonical source: _shared/${group}/${file}`);
        process.exitCode = 1;
        continue;
      }
      const want = await readFile(src, "utf8");
      if (check) {
        const have = (await exists(dest)) ? await readFile(dest, "utf8") : null;
        if (have !== want) {
          console.error(`drift: skills/${skill}/references/${group}/${file}`);
          drift += 1;
        }
      } else {
        await mkdir(path.dirname(dest), { recursive: true });
        await writeFile(dest, want);
        copied += 1;
      }
    }
  }
}

if (check) {
  if (drift > 0) {
    console.error(`${drift} reference copy(ies) drifted from _shared. Run: node scripts/sync-references.mjs`);
    process.exitCode = 1;
  } else {
    console.log("shared references are in sync");
  }
} else {
  console.log(`synced ${copied} shared reference file(s) into skill packages`);
}
