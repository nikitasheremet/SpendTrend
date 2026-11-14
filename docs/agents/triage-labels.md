# Triage Labels

The skills speak in terms of five canonical triage roles. The tracker is the spend_trend vault (see `docs/agents/issue-tracker.md`). The vault has no labels, so each role maps to a work item `status` or to the vault's `Inbox.md`.

| Label in mattpocock/skills | In the vault | Meaning |
| --- | --- | --- |
| `needs-triage` | a line in `Inbox.md` | Maintainer needs to evaluate this |
| `needs-info` | `status: blocked` + Log line saying what info is needed | Waiting on reporter for more information |
| `ready-for-agent` | `status: todo` + Log line `Ready for agent` | Fully specified, ready for an AFK agent |
| `ready-for-human` | `status: todo` + Log line `Ready for human: <why>` | Requires human implementation |
| `wontfix` | `status: dropped` + `done` date + Log line saying why | Will not be actioned |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), apply the mapping from this table.

The vault's `AGENTS.md` says to ask the user before triaging `Inbox.md` or setting anything to `dropped`. Ask before `wontfix` and before moving Inbox lines into work items.
