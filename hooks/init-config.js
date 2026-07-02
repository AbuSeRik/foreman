#!/usr/bin/env node
// Seed .claude/foreman.local.md with default tiers on first session.
// Idempotent: writes only if the file is absent. ponytail: only seeds inside an
// existing .claude project dir so it never litters an arbitrary cwd; if you want
// it created in fresh dirs too, drop the `hasClaudeDir` guard.

const fs = require("fs");
const path = require("path");

const cwd = process.cwd();
const claudeDir = path.join(cwd, ".claude");
const target = path.join(claudeDir, "foreman.local.md");

const hasClaudeDir = fs.existsSync(claudeDir);
if (!hasClaudeDir || fs.existsSync(target)) {
  process.exit(0); // nothing to do, stay silent
}

const contents = `---
scout: sonnet
typist: haiku
reviewer: codex
---

# Foreman tiers

Map orchestration roles to model tiers. The lead is your current session
(informational — you are already running it). Edit the frontmatter above; the
foreman skill reads it at activation and overrides each subagent's model.

- scout    — bulk read-only digging (cheap)
- typist   — mechanical edits (cheap)
- reviewer — optional second opinion (e.g. codex); remove the line if not installed
`;

try {
  fs.writeFileSync(target, contents);
  console.log("foreman: created .claude/foreman.local.md with default tiers — edit to change model routing.");
} catch (err) {
  // Non-fatal: never block a session over a config seed.
  process.exit(0);
}
