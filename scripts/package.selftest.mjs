import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildSkillPackage } from "./package-lib.mjs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const root = await mkdtemp(path.join(os.tmpdir(), "sorryassets-skill-bundle-"));
try {
  await mkdir(path.join(root, "prompts"), { recursive: true });
  await writeFile(path.join(root, "SKILL.md"), "# Method\n");
  await writeFile(path.join(root, "prompts", "plan.md"), "Plan.\n");

  const first = await buildSkillPackage(root);
  const second = await buildSkillPackage(root);
  assert(first.bundleBytes.equals(second.bundleBytes), "bundle bytes must reproduce exactly");
  assert(first.objectKey === second.objectKey, "bundle object key must reproduce exactly");
  assert(
    first.package.bundle.url.endsWith(`/${first.objectKey}`),
    "bundle URL must use its content-addressed object key",
  );
  assert(first.package.files.length === 2, "bundle must preserve every declared file");
} finally {
  await rm(root, { recursive: true, force: true });
}

console.log("deterministic Skill bundle selftest passed");
