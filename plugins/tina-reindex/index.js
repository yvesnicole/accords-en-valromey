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
    // Extract "owner/repo" from any GitHub URL format:
    //   https://github.com/owner/repo.git
    //   https://x-access-token:ghs_xxx@github.com/owner/repo.git  (Netlify CI)
    //   git@github.com:owner/repo.git
    const match = repoUrl.match(/[:/]([^/:]+\/[^/]+?)(?:\.git)?$/);
    if (!match) {
      console.log("tina-reindex: Could not parse repo path from remote URL, skipping push.");
      return;
    }
    const repoPath = match[1];

    const authedRemote = `https://x-access-token:${token}@github.com/${repoPath}.git`;
    execSync(`git remote set-url origin ${authedRemote}`);
    execSync("git stash --include-untracked", { encoding: "utf-8" });
    execSync("git pull --rebase origin main", { encoding: "utf-8" });
    execSync("git stash pop", { encoding: "utf-8" });
    execSync("git push origin HEAD:main");

    console.log(`tina-reindex: Pushed reindex commit at ${timestamp}`);
    console.log("tina-reindex: Tina Cloud should reindex within a few minutes.");
  },
};