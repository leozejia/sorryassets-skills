#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createReadStream } from "node:fs";
import {
  closeSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const fail = (message) => { throw new Error(message); };
const present = (file) => { try { lstatSync(file); return true; } catch { return false; } };

function parseArgs(argv) {
  const args = { clips: [], nodes: [] };
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key?.startsWith("--") || value === undefined) {
      fail(`invalid argument: ${key ?? ""}`);
    }
    if (key === "--clip") args.clips.push(value);
    else if (key === "--node") args.nodes.push(value);
    else if (key === "--out" || key === "--manifest") {
      const name = key.slice(2);
      if (args[name] !== undefined) fail(`${key} may be specified only once`);
      args[name] = value;
    } else {
      fail(`unknown argument: ${key}`);
    }
  }
  return args;
}

function requireFile(name, file) {
  if (!file || !path.isAbsolute(file)) fail(`${name} must be an absolute path`);
  if (!present(file) || !statSync(file).isFile() || statSync(file).size === 0) {
    fail(`${name} must be a non-empty file: ${file}`);
  }
  return file;
}

function run(command, args) {
  try {
    return execFileSync(command, args, {
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
      timeout: 120_000,
    });
  } catch (error) {
    if (error?.code === "ENOENT") fail(`${command} not found on PATH`);
    if (error?.code === "ETIMEDOUT") fail(`${command} timed out`);
    fail(error?.stderr?.toString().trim() || error?.message || `${command} failed`);
  }
}

function probe(file, label) {
  const data = JSON.parse(run("ffprobe", [
    "-v", "error", "-print_format", "json", "-show_format", "-show_streams", file,
  ]));
  const video = data.streams?.find((stream) => stream.codec_type === "video");
  const audio = data.streams?.find((stream) => stream.codec_type === "audio");
  const duration = Number(data.format?.duration ?? video?.duration ?? 0);
  if (!video || !Number.isFinite(duration) || duration <= 0) {
    fail(`${label} must contain video with positive duration`);
  }
  return {
    duration,
    width: video.width,
    height: video.height,
    videoCodec: video.codec_name,
    audioCodec: audio?.codec_name ?? null,
    hasAudio: Boolean(audio),
  };
}

function canonicalTarget(file) {
  return path.join(realpathSync(path.dirname(file)), path.basename(file));
}

function sha256File(file) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const input = createReadStream(file);
    input.on("error", reject);
    input.on("data", (chunk) => hash.update(chunk));
    input.on("end", () => resolve(hash.digest("hex")));
  });
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.clips.length < 2) fail("provide at least two --clip values");
  if (args.clips.length > 64) fail("at most 64 clips may be assembled at once");
  if (args.clips.length !== args.nodes.length) {
    fail("provide exactly one --node value for each --clip value");
  }
  if (args.nodes.some((node) => !node.trim())) fail("--node values must not be empty");

  const clips = args.clips.map((clip, index) => requireFile(`--clip ${index + 1}`, clip));
  const out = args.out;
  if (!out || !path.isAbsolute(out)) fail("--out must be an absolute path");
  const manifest = args.manifest ?? path.join(
    path.dirname(out), `${path.basename(out, path.extname(out))}.manifest.json`,
  );
  if (!path.isAbsolute(manifest)) fail("--manifest must be an absolute path");
  let work = null;
  let ownedOut = false;
  let ownedManifest = false;
  let complete = false;

  try {
    mkdirSync(path.dirname(out), { recursive: true });
    mkdirSync(path.dirname(manifest), { recursive: true });
    if (canonicalTarget(out) === canonicalTarget(manifest)) {
      fail("--out and --manifest must resolve to different files");
    }

    try {
      const fd = openSync(out, "wx");
      ownedOut = true;
      closeSync(fd);
    } catch (error) {
      fail(error?.code === "EEXIST"
        ? `refusing to overwrite existing output: ${out}`
        : `could not reserve output: ${error?.message ?? error}`);
    }
    try {
      const fd = openSync(manifest, "wx");
      ownedManifest = true;
      closeSync(fd);
    } catch (error) {
      fail(error?.code === "EEXIST"
        ? `refusing to overwrite existing manifest: ${manifest}`
        : `could not reserve manifest: ${error?.message ?? error}`);
    }

    const sources = clips.map((clip, index) => ({
      order: index + 1,
      nodeId: args.nodes[index],
      path: clip,
      ...probe(clip, `--clip ${index + 1}`),
    }));
    work = mkdtempSync(path.join(tmpdir(), "sorryassets-assemble-"));
    const escape = (value) => value.replaceAll("'", "'\\''");
    const list = path.join(work, "clips.txt");
    writeFileSync(list, `${clips.map((clip) => `file '${escape(clip)}'`).join("\n")}\n`);
    run("ffmpeg", [
      "-v", "error", "-xerror", "-y", "-f", "concat", "-safe", "0", "-i", list,
      "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", out,
    ]);

    const media = probe(out, "assembled output");
    const expected = sources.reduce((total, source) => total + source.duration, 0);
    const tolerance = Math.max(0.5, expected * 0.05);
    if (Math.abs(media.duration - expected) > tolerance) {
      fail(`assembled duration ${media.duration}s differs from expected ${expected}s`);
    }

    const sha256 = await sha256File(out);
    const body = {
      kind: "sorryassets.video-assembly",
      version: 1,
      sources,
      output: { path: out, sha256, ...media },
    };
    writeFileSync(manifest, `${JSON.stringify(body, null, 2)}\n`);
    complete = true;
    console.log(JSON.stringify({ ok: true, manifest, ...body }, null, 2));
  } finally {
    if (work) rmSync(work, { recursive: true, force: true });
    if (!complete) {
      if (ownedOut) rmSync(out, { force: true });
      if (ownedManifest) rmSync(manifest, { force: true });
    }
  }
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
