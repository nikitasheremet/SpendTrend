# Triage Labels

The skills speak in terms of five canonical triage roles. The tracker is the spend_trend vault (see `docs/agents/issue-tracker.md`). The vault has no labels: four roles are values of the work item `triage` property, and `wontfix` is `status: dropped`.

| Label in mattpocock/skills | In the vault | Meaning |
| --- | --- | --- |
| `needs-triage` | `triage: needs-triage` (loose ideas can also sit as a line in `Inbox.md`) | Maintainer needs to evaluate this |
| `needs-info` | `triage: needs-info` + `status: blocked` + Log line saying what info is needed | Waiting on reporter for more information |
| `ready-for-agent` | `triage: ready-for-agent` + `status: todo` | Fully specified, ready for an AFK agent |
| `ready-for-human` | `triage: ready-for-human` + `status: todo` + Log line saying why | Requires human implementation |
| `wontfix` | `status: dropped` + `done` date + Log line saying why; clear `triage` | Will not be actioned |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), set the property from this table. "Removing" a label means clearing `triage`. Clear it too when an item moves to `doing`, `done` or `dropped`.

`python3 tools/tree.py --check` rejects unknown `triage` values, `needs-info` without `status: blocked`, and a `triage` value on a closed item.

The vault's `AGENTS.md` says to ask the user before triaging `Inbox.md` or setting anything to `dropped`. Ask before `wontfix` and before moving Inbox lines into work items.
