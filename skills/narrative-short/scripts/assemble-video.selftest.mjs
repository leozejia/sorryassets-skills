#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const helper = path.join(here, "assemble-video.mjs");
const work = path.join(tmpdir(), `sorryassets-assemble-selftest-${Date.now()}`);
mkdirSync(work, { recursive: true });

function invoke(args, succeeds = true) {
  const result = spawnSync("node", [helper, ...args], {
    encoding: "utf8",
    timeout: 30_000,
  });
  if (result.error?.code === "ETIMEDOUT") throw new Error("assembly helper timed out");
  if ((result.status === 0) !== succeeds) {
    throw new Error(result.stderr || result.stdout || `unexpected exit ${result.status}`);
  }
  return result;
}

function makeClip(file, color) {
  const result = spawnSync("ffmpeg", [
    "-v", "error", "-y", "-f", "lavfi", "-i", `color=c=${color}:s=320x240:d=0.5`,
    "-f", "lavfi", "-i", "sine=frequency=440:duration=0.5", "-c:v", "libx264",
    "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", file,
  ], { encoding: "utf8", timeout: 30_000 });
  if (result.error?.code === "ETIMEDOUT") throw new Error("ffmpeg fixture timed out");
  if (result.status !== 0) throw new Error(result.stderr || "ffmpeg fixture failed");
}

try {
  const clips = ["blue", "red", "green"].map((color) => {
    const file = path.join(work, `${color}.mp4`);
    makeClip(file, color);
    return file;
  });

  const out = path.join(work, "video.mp4");
  const manifest = path.join(work, "manifest.json");
  const sequence = clips.flatMap((clip, index) => [
    "--clip", clip, "--node", `shot-${index + 1}`,
  ]);
  const success = invoke([...sequence, "--out", out, "--manifest", manifest]);
  const summary = JSON.parse(success.stdout);
  const body = JSON.parse(readFileSync(manifest, "utf8"));
  if (!summary.ok || body.kind !== "sorryassets.video-assembly") {
    throw new Error("invalid success contract");
  }
  if (body.sources?.length !== 3 || body.sources[2].nodeId !== "shot-3") {
    throw new Error("source order mismatch");
  }
  if (body.output.sha256?.length !== 64) throw new Error("missing SHA-256");
  if (body.output.width !== 320 || body.output.height !== 240) {
    throw new Error("wrong output size");
  }
  if (Math.abs(body.output.duration - 1.5) > 0.5) throw new Error("wrong output duration");
  invoke([...sequence, "--out", out], false);

  const keptManifest = path.join(work, "kept.json");
  const reservedOut = path.join(work, "reserved.mp4");
  writeFileSync(keptManifest, "keep me");
  invoke([...sequence, "--out", reservedOut, "--manifest", keptManifest], false);
  if (existsSync(reservedOut) || readFileSync(keptManifest, "utf8") !== "keep me") {
    throw new Error("existing manifest was changed or owned output was left behind");
  }

  const same = path.join(work, "same-target");
  invoke([...sequence, "--out", same, "--manifest", same], false);
  if (existsSync(same)) throw new Error("same target should not be created");

  const mismatched = path.join(work, "mismatched.mp4");
  invoke([
    "--clip", clips[0], "--node", "shot-1", "--clip", clips[1],
    "--out", mismatched,
  ], false);
  if (existsSync(mismatched)) throw new Error("mismatched input left output behind");

  const corrupt = path.join(work, "corrupt.mp4");
  const failedOut = path.join(work, "failed.mp4");
  const failedManifest = path.join(work, "failed.json");
  writeFileSync(corrupt, "not a video");
  invoke([
    "--clip", clips[0], "--node", "shot-1", "--clip", corrupt,
    "--node", "shot-2", "--out", failedOut, "--manifest", failedManifest,
  ], false);
  if (existsSync(failedOut) || existsSync(failedManifest)) {
    throw new Error("failed assembly left output files");
  }

  console.log("assemble-video.selftest: ok");
} finally {
  rmSync(work, { recursive: true, force: true });
}
