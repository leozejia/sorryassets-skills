#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const helper = path.join(here, "extract-frames.mjs");
const work = path.join(tmpdir(), `sorryassets-extract-selftest-${Date.now()}`);
mkdirSync(work, { recursive: true });

function invoke(args, succeeds = true) {
  const result = spawnSync("node", [helper, ...args], {
    encoding: "utf8",
    timeout: 30_000,
  });
  if (result.error?.code === "ETIMEDOUT") throw new Error("extract helper timed out");
  if ((result.status === 0) !== succeeds) {
    throw new Error(result.stderr || result.stdout || `unexpected exit ${result.status}`);
  }
  return result;
}

try {
  const video = path.join(work, "reference.mp4");
  const fixture = spawnSync("ffmpeg", [
    "-v", "error", "-y", "-f", "lavfi", "-i", "testsrc=size=320x240:rate=10:duration=2",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", video,
  ], { encoding: "utf8", timeout: 30_000 });
  if (fixture.error?.code === "ETIMEDOUT") throw new Error("ffmpeg fixture timed out");
  if (fixture.status !== 0) throw new Error(fixture.stderr || "ffmpeg fixture failed");

  const outDir = path.join(work, "frames");
  const success = invoke(["--video", video, "--out-dir", outDir, "--frames", "4"]);
  const summary = JSON.parse(success.stdout);
  const manifest = JSON.parse(readFileSync(path.join(outDir, "frames.manifest.json"), "utf8"));
  if (!summary.ok || manifest.kind !== "sorryassets.frame-extraction") {
    throw new Error("invalid success contract");
  }
  if (manifest.frames?.length !== 4) throw new Error("expected 4 frames");
  for (const frame of manifest.frames) {
    if (!existsSync(frame.path)) throw new Error(`missing frame: ${frame.path}`);
    if (frame.sha256?.length !== 64) throw new Error("missing frame SHA-256");
    if (frame.timestamp < 0 || frame.timestamp > manifest.source.duration) {
      throw new Error("frame timestamp outside source duration");
    }
  }
  if (manifest.source.sha256?.length !== 64) throw new Error("missing source SHA-256");

  // Refuses a non-empty output directory.
  invoke(["--video", video, "--out-dir", outDir, "--frames", "4"], false);

  // Rejects relative paths and bad frame counts.
  invoke(["--video", "relative.mp4", "--out-dir", path.join(work, "x")], false);
  invoke(["--video", video, "--out-dir", path.join(work, "y"), "--frames", "0"], false);
  invoke(["--video", video, "--out-dir", path.join(work, "z"), "--frames", "65"], false);

  // Rejects a non-video input.
  const bogus = path.join(work, "bogus.mp4");
  writeFileSync(bogus, "not a video");
  invoke(["--video", bogus, "--out-dir", path.join(work, "w")], false);

  console.log("extract-frames.selftest: ok");
} finally {
  rmSync(work, { recursive: true, force: true });
}
