/**
 * Netlify Build Plugin: Tina Cloud Auto-Reindex
 *
 * Pushes a timestamp update to tina/tina-lock.json after each deploy
 * to force Tina Cloud content reindex (prevents ghost folders in admin UI).
 *
 * Setup: Add REINDEX_GITHUB_TOKEN (GitHub PAT with repo scope) in
 * Netlify → Site settings → Environment variables.
 *
 * Loop prevention: Commits include "[tina-reindex]" in the message;
 * the plugin skips if the current commit already contains that tag.
 */

module.exports = {
  name: "tina-reindex",

  onPostBuild: async () => {
    const { execSync } = require("node:child_process");
    const { readFileSync, writeFileSync } = require("node:fs");
    const path = require("node:path");

    const token = process.env.REINDEX_GITHUB_TOKEN;
    if (!token) {
      console.log("tina-reindex: REINDEX_GITHUB_TOKEN not set, skipping.");
      return;
    }

    const lastCommitMsg = execSync("git log -1 --pretty=%B", {
      encoding: "utf-8",
    }).trim();
    if (lastCommitMsg.includes("[tina-reindex]")) {
      console.log("tina-reindex: Last commit is already a reindex, skipping.");
      return;
    }

    const repoRoot = process.env.REPO_ROOT || process.cwd();
    const lockFile = path.join(repoRoot, "tina", "tina-lock.json");

    let data;
    try {
      data = JSON.parse(readFileSync(lockFile, "utf8"));
    } catch (err) {
      console.log("tina-reindex: Could not read tina-lock.json, skipping.", err.message);
      return;
    }

    const timestamp = new Date().toISOString();
    data._reindexedAt = timestamp;
    writeFileSync(lockFile, JSON.stringify(data));

    execSync('git config user.name "Tina Reindex Bot"');
    execSync('git config user.email "tina-reindex-bot@users.noreply.github.com"');
    execSync("git add tina/tina-lock.json");
    execSync(
      `git commit -m "chore: force Tina Cloud reindex [tina-reindex] (${timestamp})"`
    );

    const repoUrl = execSync("git remote get-url origin", { encoding: "utf-8" }).trim();
    let repoPath;
    if (repoUrl.startsWith("https://")) {
      repoPath = repoUrl.replace("https://github.com/", "").replace(/\.git$/, "");
    } else if (repoUrl.startsWith("git@github.com:")) {
      repoPath = repoUrl.replace("git@github.com:", "").replace(/\.git$/, "");
    } else {
      console.log("tina-reindex: Unrecognized remote URL format, skipping push.");
      return;
    }

    execSync(`git push https://${token}@github.com/${repoPath}.git HEAD:main`);

    console.log(`tina-reindex: Pushed reindex commit at ${timestamp}`);
    console.log("tina-reindex: Tina Cloud should reindex within a few minutes.");
  },
};