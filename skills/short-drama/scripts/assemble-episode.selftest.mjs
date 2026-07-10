#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const helper = path.join(here, "assemble-episode.mjs");
const work = path.join(tmpdir(), `sorryassets-assemble-selftest-${Date.now()}`);
mkdirSync(work, { recursive: true });

function invoke(args, succeeds = true) {
  const result = spawnSync("node", [helper, ...args], { encoding: "utf8" });
  if ((result.status === 0) !== succeeds) {
    throw new Error(result.stderr || result.stdout || `unexpected exit ${result.status}`);
  }
  return result;
}

function makeClip(file, color) {
  const result = spawnSync("ffmpeg", [
    "-v", "error", "-y", "-f", "lavfi", "-i", `color=c=${color}:s=720x1280:d=1`,
    "-f", "lavfi", "-i", "sine=frequency=440:duration=1", "-c:v", "libx264",
    "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", file,
  ], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || "ffmpeg fixture failed");
}

try {
  const a = path.join(work, "a.mp4");
  const b = path.join(work, "b.mp4");
  makeClip(a, "blue");
  makeClip(b, "red");

  const out = path.join(work, "episode.mp4");
  const manifest = path.join(work, "manifest.json");
  const common = ["--clip-a", a, "--clip-b", b, "--node-a", "shot-1", "--node-b", "shot-2"];
  const success = invoke([...common, "--out", out, "--manifest", manifest]);
  const summary = JSON.parse(success.stdout);
  const body = JSON.parse(readFileSync(manifest, "utf8"));
  if (!summary.ok || body.sources?.length !== 2) throw new Error("invalid success contract");
  if (body.sources[0].nodeId !== "shot-1" || body.sources[1].nodeId !== "shot-2") {
    throw new Error("source order mismatch");
  }
  if (body.output.sha256?.length !== 64) throw new Error("missing SHA-256");
  if (body.output.width !== 720 || body.output.height !== 1280) throw new Error("wrong output size");
  if (Math.abs(body.output.duration - 2) > 0.5) throw new Error("wrong output duration");
  invoke([...common, "--out", out], false);

  const keptManifest = path.join(work, "kept.json");
  const reservedOut = path.join(work, "reserved.mp4");
  writeFileSync(keptManifest, "keep me");
  invoke([...common, "--out", reservedOut, "--manifest", keptManifest], false);
  if (existsSync(reservedOut) || readFileSync(keptManifest, "utf8") !== "keep me") {
    throw new Error("existing manifest was changed or owned output was left behind");
  }

  const same = path.join(work, "same-target");
  invoke([...common, "--out", same, "--manifest", same], false);
  if (existsSync(same)) throw new Error("same target should not be created");

  const corrupt = path.join(work, "corrupt.mp4");
  const failedOut = path.join(work, "failed.mp4");
  const failedManifest = path.join(work, "failed.json");
  writeFileSync(corrupt, "not a video");
  invoke([
    "--clip-a", a, "--clip-b", corrupt, "--out", failedOut,
    "--node-a", "shot-1", "--node-b", "shot-2", "--manifest", failedManifest,
  ], false);
  if (existsSync(failedOut) || existsSync(failedManifest)) {
    throw new Error("failed assembly left output files");
  }

  console.log("assemble-episode.selftest: ok");
} finally {
  rmSync(work, { recursive: true, force: true });
}
