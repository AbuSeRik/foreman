<h1 align="center">Foreman</h1>

<p align="center">
  <em>The lead decides. The cheap models read and type.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude%20Code-plugin-111111?style=flat-square" alt="Claude Code plugin">
  <img src="https://img.shields.io/badge/license-MIT-111111?style=flat-square" alt="MIT license">
</p>

**Foreman** is a Claude Code plugin that turns your current top-tier session into a **foreman**: it keeps decomposition, architecture, contested decisions and final synthesis, and delegates everything else to cheaper subagents. Bulk reading goes to a read-only **scout**, mechanical edits go to a **typist**, and risky decisions get a second opinion from a **reviewer** (Codex, if installed).

Unlike model-locked orchestration plugins, Foreman is **role-based**. You map roles to model tiers once in a config file, so it works on any top session — Opus today, whatever is strongest tomorrow — without editing the plugin.

## Why

Running your best model on grunt work wastes two things:

1. **Tokens / usage limits.** Every test file, rename and formatting pass burns top-tier budget.
2. **Context.** Reading 40 files to find one bug pollutes the main conversation. After a compact, the reasoning that mattered may be gone.

Foreman separates these two wins instead of blurring them:

- **Cost** comes from routing bulk reads and mechanical edits to *cheap* models.
- **Context isolation** comes from subagents running in their own windows and returning only a distilled conclusion.

A pricey subagent doing long reads buys isolation but not cost savings — Foreman is explicit about which win each route gives, so you don't pay top-tier rates and call it "savings."

## How it works

| Work | Goes to | Win |
|---|---|---|
| Bulk reads: codebase slices, logs, multi-file search, "does X already exist?" | `scout` (cheap, read-only) | Cost + isolation |
| Mechanical edits with a clear spec: tests, boilerplate, formatting, renames | `typist` (cheap) | Cost |
| Reads that need reasoning *while* reading | `scout` on a raised tier, or the lead | Isolation only |
| Risky/contested decisions | `reviewer` (Codex, optional) | Second opinion |
| Decomposition, architecture, review, synthesis | the lead (you) | Judgment |

Determinism is enforced where the harness allows, not merely requested:

- **Least-privilege tools.** `scout` is denied `Write`/`Edit` at the harness level — it physically cannot modify files. `typist` ships without `Bash` by default: no network escape hatch. Bash is granted per-task only when a verification run needs it.
- **Configurable tiers.** `.claude/foreman.local.md` maps `scout` / `typist` / `reviewer` to models. Change one line when tiers shift; the plugin doesn't care which model is on top.
- **Spec template.** Every delegation ships as Goal / Files in-and-out of scope / Constraints / Definition of done / Report format. Subagents never see your conversation, so specs are self-contained.
- **Acceptance gate.** A result without the required report structure or without verification output is a failed delegation and is not integrated.
- **Failure policy.** Never retry the same spec verbatim; two failed rounds and the lead does it personally.
- **One writer per file set.** Parallel delegations must have disjoint file scopes.
- **YAGNI at decomposition.** Speculative parts are cut before routing, not built.

## Install

```
/plugin marketplace add AbuSeRik/foreman
/plugin install foreman@foreman
```

Restart the session, then activate on a top-tier session:

```
/foreman
```

On first session the plugin seeds `.claude/foreman.local.md` with default tiers (only inside a dir that already has a `.claude/`). Edit it to change routing:

```yaml
scout: sonnet
typist: haiku
reviewer: codex
```

Give it substantial multi-step work. Check the receipt anytime:

```
/foreman-gain
```

## What's inside

```
skills/foreman/SKILL.md    # the role playbook: matrix, spec template, gates, tier config
agents/scout.md            # read-only digger — cheap default, returns distilled findings
agents/typist.md           # mechanical executor — verified work, shortest diff, no Bash by default
commands/foreman-gain.md   # session receipt: what ran cheap, what stayed isolated
hooks/hooks.json           # SessionStart hook registration
hooks/init-config.js       # seeds .claude/foreman.local.md with default tiers (idempotent)
```

## Prior art

Inspired by [AndyShaman/senior-fable](https://github.com/AndyShaman/senior-fable) (the Fable-locked orchestration plugin) and [wshobson/agents](https://github.com/wshobson/agents) (per-agent model-tier marketplace). Foreman's contribution: role-based tiers instead of a hardcoded model family, an honest split between the cost win and the isolation win, and a tighter tool least-privilege on the typist.

## License

MIT © [AbuSeRik](https://github.com/AbuSeRik)
