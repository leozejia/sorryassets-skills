#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const fail = (message) => { throw new Error(message); };
const present = (file) => { try { lstatSync(file); return true; } catch { return false; } };

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key?.startsWith("--") || value === undefined) {
      fail(`invalid argument: ${key ?? ""}`);
    }
    const name = key.slice(2);
    if (!["video", "out-dir", "frames"].includes(name)) fail(`unknown argument: ${key}`);
    if (args[name] !== undefined) fail(`${key} may be specified only once`);
    args[name] = value;
  }
  return args;
}

function run(command, cmdArgs) {
  try {
    return execFileSync(command, cmdArgs, {
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

function probe(file) {
  const data = JSON.parse(run("ffprobe", [
    "-v", "error", "-print_format", "json", "-show_format", "-show_streams", file,
  ]));
  const video = data.streams?.find((stream) => stream.codec_type === "video");
  const duration = Number(data.format?.duration ?? video?.duration ?? 0);
  if (!video || !Number.isFinite(duration) || duration <= 0) {
    fail("--video must contain a video stream with positive duration");
  }
  return {
    duration,
    width: video.width,
    height: video.height,
    videoCodec: video.codec_name,
    hasAudio: Boolean(data.streams?.some((stream) => stream.codec_type === "audio")),
  };
}

function sha256File(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function main() {
  const args = parseArgs(process.argv);
  const video = args.video;
  if (!video || !path.isAbsolute(video)) fail("--video must be an absolute path");
  if (!present(video) || !statSync(video).isFile() || statSync(video).size === 0) {
    fail(`--video must be a non-empty file: ${video}`);
  }
  const outDir = args["out-dir"];
  if (!outDir || !path.isAbsolute(outDir)) fail("--out-dir must be an absolute path");
  const frameCount = Number(args.frames ?? 8);
  if (!Number.isInteger(frameCount) || frameCount < 1 || frameCount > 64) {
    fail("--frames must be an integer between 1 and 64");
  }

  mkdirSync(outDir, { recursive: true });
  if (readdirSync(outDir).length !== 0) {
    fail(`refusing to write into a non-empty directory: ${outDir}`);
  }

  const media = probe(video);
  // Sample midpoints of equal segments so first/last frames of the file are
  // represented without duplicating near-identical boundary frames.
  const timestamps = Array.from({ length: frameCount }, (_, index) =>
    Number((media.duration * (index + 0.5) / frameCount).toFixed(3)));

  const frames = [];
  let complete = false;
  try {
    for (let index = 0; index < timestamps.length; index += 1) {
      const file = path.join(outDir, `frame-${String(index + 1).padStart(2, "0")}.jpg`);
      run("ffmpeg", [
        "-v", "error", "-xerror", "-ss", String(timestamps[index]), "-i", video,
        "-frames:v", "1", "-q:v", "3", file,
      ]);
      if (!present(file) || statSync(file).size === 0) {
        fail(`frame extraction produced no output at ${timestamps[index]}s`);
      }
      frames.push({
        order: index + 1,
        timestamp: timestamps[index],
        path: file,
        bytes: statSync(file).size,
        sha256: sha256File(file),
      });
    }

    const manifest = path.join(outDir, "frames.manifest.json");
    const body = {
      kind: "sorryassets.frame-extraction",
      version: 1,
      source: { path: video, sha256: sha256File(video), ...media },
      frames,
    };
    writeFileSync(manifest, `${JSON.stringify(body, null, 2)}\n`, { flag: "wx" });
    complete = true;
    console.log(JSON.stringify({ ok: true, manifest, ...body }, null, 2));
  } finally {
    if (!complete) {
      for (const frame of frames) rmSync(frame.path, { force: true });
    }
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
