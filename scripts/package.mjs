#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSkillPackage, writeBundleOutput } from "./package-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "catalog.json");

function fail(message) {
  throw new Error(message);
}

async function readCatalog() {
  return JSON.parse(await readFile(catalogPath, "utf8"));
}

async function buildPackages(catalog) {
  const built = [];
  for (const skill of catalog.skills ?? []) {
    if (
      typeof skill.id !== "string" ||
      !/^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/.test(skill.id) ||
      skill.name !== skill.id ||
      skill.path !== `skills/${skill.id}`
    ) {
      fail("catalog contains an unsafe package identity");
    }
    built.push(await buildSkillPackage(path.join(root, "skills", skill.id)));
  }
  return built;
}

function assertCatalogPackages(catalog, built) {
  if (catalog.version !== 2) fail("catalog version must be 2");
  if (built.length !== (catalog.skills?.length ?? 0)) fail("catalog package count drifted");
  for (let index = 0; index < built.length; index += 1) {
    const skill = catalog.skills[index];
    if (JSON.stringify(skill.package) !== JSON.stringify(built[index].package)) {
      fail(`${skill.name}: catalog package and deterministic bundle metadata drifted`);
    }
  }
}

async function sync() {
  const catalog = await readCatalog();
  catalog.version = 2;
  catalog.updatedAt = new Date().toISOString().slice(0, 10);
  const built = await buildPackages(catalog);
  for (let index = 0; index < built.length; index += 1) {
    catalog.skills[index].package = built[index].package;
  }
  await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Synced ${built.length} deterministic Skill bundles.`);
}

async function verify() {
  const catalog = await readCatalog();
  const built = await buildPackages(catalog);
  assertCatalogPackages(catalog, built);
  console.log(`Verified ${built.length} deterministic Skill bundles.`);
  return built;
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === "sync" && args.length === 0) {
    await sync();
    return;
  }
  if (command === "verify" && args.length === 0) {
    await verify();
    return;
  }
  if (command === "build" && args.length === 2 && args[0] === "--output") {
    const built = await verify();
    await writeBundleOutput(path.resolve(args[1]), built);
    console.log(`Built immutable Skill objects in ${path.resolve(args[1])}.`);
    return;
  }
  fail("usage: package.mjs <sync|verify|build --output <empty-directory>>");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
