// Reproduction test for the security dependency pins:
// - GHSA-27r3-jxmh-p828: body-parser DoS, patched in body-parser@2.4.0
// - GHSA-q7qp-rjg7-q26m: multer DoS, patched in multer@2.5.0
// The fix resolves body-parser >= 2.4.0 and multer >= 2.5.0 in
// backend/package-lock.json; this test guards those resolved versions.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const lockfile = JSON.parse(
  readFileSync(path.join(here, "..", "package-lock.json"), "utf8")
);

function compareVersions(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x !== y) return x - y;
  }
  return 0;
}

test("resolved body-parser is at or above fixed version 2.4.0", () => {
  const version = lockfile.packages["node_modules/body-parser"].version;
  assert.ok(
    compareVersions(version, "2.4.0") >= 0,
    `body-parser resolved to ${version}; expected >= 2.4.0 (GHSA-27r3-jxmh-p828)`
  );
});

test("resolved multer is at or above fixed version 2.5.0", () => {
  const version = lockfile.packages["node_modules/multer"].version;
  assert.ok(
    compareVersions(version, "2.5.0") >= 0,
    `multer resolved to ${version}; expected >= 2.5.0 (GHSA-q7qp-rjg7-q26m)`
  );
});
