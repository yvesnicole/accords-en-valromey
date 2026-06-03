#!/usr/bin/env node

/**
 * Force TinaCMS Cloud to reindex the main branch content.
 *
 * Tina Cloud has no public API to trigger a reindex. The documented workaround
 * is to push a whitespace change to `tina/tina-lock.json`, which triggers the
 * GitHub → Tina Cloud webhook → full branch reindex.
 *
 * This script:
 * 1. Reads tina/tina-lock.json
 * 2. Adds/updates a `_reindexedAt` timestamp field
 * 3. Commits and pushes to main
 *
 * Usage: npm run reindex
 */

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const LOCK_FILE = "tina/tina-lock.json";

// Read and parse the lock file
const raw = readFileSync(LOCK_FILE, "utf8");
const data = JSON.parse(raw);

// Add/update the reindex timestamp
data._reindexedAt = new Date().toISOString();

// Write back with the same formatting (single-line, like Tina generates it)
writeFileSync(LOCK_FILE, JSON.stringify(data));

// Stage, commit, push
const timestamp = data._reindexedAt;
execSync("git add tina/tina-lock.json", { stdio: "inherit" });
execSync(`git commit -m "chore: force Tina Cloud reindex [${timestamp}]"`, {
  stdio: "inherit",
});
execSync("git push origin main", { stdio: "inherit" });

console.log(`\n✅ Tina Cloud reindex triggered at ${timestamp}`);
console.log(
  "The admin UI should update within a few minutes after the push reaches GitHub.",
);