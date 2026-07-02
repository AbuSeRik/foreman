---
description: Show what foreman delegated this session and where the heavy work ran, so the cost/isolation win is visible instead of assumed.
---

Report the orchestration receipt for this session.

From the delegations you have made so far (scout and typist subagent calls),
produce a compact table. You do not have exact token telemetry, so report what
you can attest to and mark estimates as estimates. Do not invent numbers.

Output format:

```
FOREMAN RECEIPT

role     model     calls   what ran there
scout    <model>   <n>     bulk reads kept out of main window
typist   <model>   <n>     mechanical edits
lead     <model>   —       decisions, review, synthesis

Isolation: ~<estimate> of reading/log-grinding stayed in subagent windows,
           not the main context.
Cost:      <n> delegations ran on cheap tiers instead of the lead.
```

If nothing has been delegated yet this session, say so plainly and note that
the task may simply have had no delegable parts (which is fine — see the
anti-rules in the foreman skill).
