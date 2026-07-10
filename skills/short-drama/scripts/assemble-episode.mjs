#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  closeSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
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
  const args = {};
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i];
    if (!key?.startsWith("--") || argv[i + 1] === undefined) fail(`invalid argument: ${key ?? ""}`);
    args[key.slice(2)] = argv[i + 1];
  }
  return args;
}

function requireFile(name, file) {
  if (!file || !path.isAbsolute(file)) fail(`--${name} must be an absolute path`);
  if (!present(file) || !statSync(file).isFile() || statSync(file).size === 0) {
    fail(`--${name} must be a non-empty file: ${file}`);
  }
  return file;
}

function run(command, args) {
  try {
    return execFileSync(command, args, { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  } catch (error) {
    if (error?.code === "ENOENT") fail(`${command} not found on PATH`);
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

function main() {
  const args = parseArgs(process.argv);
  const clipA = requireFile("clip-a", args["clip-a"]);
  const clipB = requireFile("clip-b", args["clip-b"]);
  const out = args.out;
  if (!out || !path.isAbsolute(out)) fail("--out must be an absolute path");
  if (!args["node-a"] || !args["node-b"]) fail("--node-a and --node-b are required");
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

    const sourceA = probe(clipA, "--clip-a");
    const sourceB = probe(clipB, "--clip-b");
    work = mkdtempSync(path.join(tmpdir(), "sorryassets-assemble-"));
    const escape = (value) => value.replaceAll("'", "'\\''");
    const list = path.join(work, "clips.txt");
    writeFileSync(list, `file '${escape(clipA)}'\nfile '${escape(clipB)}'\n`);
    run("ffmpeg", [
      "-v", "error", "-xerror", "-y", "-f", "concat", "-safe", "0", "-i", list,
      "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", out,
    ]);

    const media = probe(out, "assembled output");
    const expected = sourceA.duration + sourceB.duration;
    const tolerance = Math.max(0.5, expected * 0.05);
    if (Math.abs(media.duration - expected) > tolerance) {
      fail(`assembled duration ${media.duration}s differs from expected ${expected}s`);
    }

    // ponytail: the accepted 30s/720p ceiling keeps synchronous hashing bounded.
    const sha256 = createHash("sha256").update(readFileSync(out)).digest("hex");
    const body = {
      kind: "sorryassets.episode-assembly",
      version: 1,
      sources: [
        { order: 1, nodeId: args["node-a"], path: clipA, duration: sourceA.duration },
        { order: 2, nodeId: args["node-b"], path: clipB, duration: sourceB.duration },
      ],
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
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
