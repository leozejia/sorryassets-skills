import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import yazl from "yazl";

export const PUBLIC_ROOT = "https://dl.sorryassets.com";
export const BUNDLE_FORMAT = "zip";
export const BUNDLE_CONTENT_TYPE = "application/zip";
export const BUNDLE_CACHE_CONTROL = "public,max-age=31536000,immutable";

const FIXED_MTIME = new Date(1980, 0, 1, 0, 0, 0);
const FIXED_FILE_MODE = 0o100644;
const MAX_PACKAGE_BYTES = 64 * 1024 * 1024;
const MAX_PACKAGE_FILES = 256;
const MAX_PATH_BYTES = 512;

export function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export async function filesUnder(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const item = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(item));
    else if (entry.isFile()) files.push(item);
    else throw new Error(`package source contains an unsupported entry: ${item}`);
  }
  return files;
}

export async function packageManifest(directory) {
  const root = await lstat(directory);
  if (!root.isDirectory() || root.isSymbolicLink()) {
    throw new Error(`package source is not a real directory: ${directory}`);
  }
  const files = [];
  for (const file of await filesUnder(directory)) {
    const body = await readFile(file);
    const relative = path.relative(directory, file).split(path.sep).join("/");
    if (
      !relative ||
      Buffer.byteLength(relative) > MAX_PATH_BYTES ||
      relative.includes("\\") ||
      relative.split("/").some((part) => !part || part === "." || part === "..")
    ) {
      throw new Error(`package source contains an unsafe path: ${relative}`);
    }
    files.push({
      path: relative,
      bytes: body.length,
      sha256: sha256(body),
    });
  }
  files.sort((left, right) => {
    const leftPath = left.path.toLowerCase();
    const rightPath = right.path.toLowerCase();
    return leftPath < rightPath ? -1 : leftPath > rightPath ? 1 : 0;
  });
  if (files.length === 0 || files.length > MAX_PACKAGE_FILES) {
    throw new Error(`package source file count is outside 1..${MAX_PACKAGE_FILES}`);
  }
  for (let index = 1; index < files.length; index += 1) {
    if (files[index - 1].path.toLowerCase() === files[index].path.toLowerCase()) {
      throw new Error(`package source contains case-colliding paths: ${files[index].path}`);
    }
  }
  const totalBytes = files.reduce((total, file) => total + file.bytes, 0);
  if (totalBytes > MAX_PACKAGE_BYTES) {
    throw new Error(`package source exceeds ${MAX_PACKAGE_BYTES} bytes`);
  }
  const canonical = files
    .map((file) => `${file.path}\0${file.bytes}\0${file.sha256}\n`)
    .join("");
  return {
    digest: sha256(Buffer.from(canonical)),
    totalBytes,
    files,
  };
}

export function bundleObjectKey(bundleSha256) {
  return `skills/sha256/${bundleSha256}.zip`;
}

export async function buildSkillPackage(directory) {
  const manifest = await packageManifest(directory);
  const bundleBytes = await createBundle(directory, manifest.files);
  const bundleSha256 = sha256(bundleBytes);
  const objectKey = bundleObjectKey(bundleSha256);
  return {
    package: {
      ...manifest,
      bundle: {
        format: BUNDLE_FORMAT,
        url: `${PUBLIC_ROOT}/${objectKey}`,
        bytes: bundleBytes.length,
        sha256: bundleSha256,
      },
    },
    bundleBytes,
    objectKey,
  };
}

export async function writeBundleOutput(output, packages) {
  await mkdir(output, { recursive: true });
  const existing = await readdir(output);
  if (existing.length !== 0) {
    throw new Error(`bundle output must be empty: ${output}`);
  }
  const objectsByKey = new Map();
  for (const built of packages) {
    const existingObject = objectsByKey.get(built.objectKey);
    if (existingObject) {
      if (!existingObject.bytes.equals(built.bundleBytes)) {
        throw new Error(`content-addressed bundle collision: ${built.objectKey}`);
      }
      continue;
    }
    const outputPath = path.join(output, built.objectKey);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, built.bundleBytes, { flag: "wx" });
    objectsByKey.set(built.objectKey, {
      bytes: built.bundleBytes,
      manifest: {
        key: built.objectKey,
        file: built.objectKey,
        bytes: built.bundleBytes.length,
        sha256: built.package.bundle.sha256,
        contentType: BUNDLE_CONTENT_TYPE,
        cacheControl: BUNDLE_CACHE_CONTROL,
      },
    });
  }
  const objects = [...objectsByKey.values()].map((object) => object.manifest);
  objects.sort((left, right) => left.key.localeCompare(right.key));
  await writeFile(
    path.join(output, "publish-manifest.json"),
    `${JSON.stringify({ schemaVersion: 1, objects }, null, 2)}\n`,
    { flag: "wx" },
  );
}

async function createBundle(directory, files) {
  const archive = new yazl.ZipFile();
  const chunks = [];
  const completed = new Promise((resolve, reject) => {
    archive.outputStream.on("data", (chunk) => chunks.push(chunk));
    archive.outputStream.once("error", reject);
    archive.outputStream.once("end", () => resolve(Buffer.concat(chunks)));
  });
  for (const file of files) {
    const body = await readFile(path.join(directory, file.path));
    if (body.length !== file.bytes || sha256(body) !== file.sha256) {
      throw new Error(`package file changed while bundling: ${file.path}`);
    }
    archive.addBuffer(body, file.path, {
      mtime: FIXED_MTIME,
      mode: FIXED_FILE_MODE,
      compress: false,
      forceDosTimestamp: true,
    });
  }
  archive.end();
  return completed;
}
