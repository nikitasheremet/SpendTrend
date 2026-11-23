# Issue tracker: the spend_trend vault

Work for this repo is planned and tracked in the **spend_trend Obsidian vault** at `~/Documents/vaults/spend_trend`, as plain Markdown files. It is a separate git repo, not part of this one.

Before touching the vault, read its `AGENTS.md`. It is the authority on the schema, status rules and what needs the user's OK. This file only maps tracker operations onto it.

Older trackers are history only:
- GitHub Issues `#1`–`#141` (2025), `#284`–`#357` (2025-11 → 2026-11)
- Linear `SPE-<n>` (2025-11 → 2026-10), referenced in git history and `.claude/plans/`

Every Linear and GitHub issue was migrated into the vault (W-0063); each work item lists its old IDs in the `source` property, so search the vault for `SPE-127` or `#318` to find one (`grep -rl 'SPE-127' work/`). Small closed tickets were folded into their theme item's Steps.

Linear still receives **Failed Add Data Paste Reports** (see `docs/adr/0002-failed-paste-reports-scrambled-and-filed-in-linear.md`). That is a product feature, not where work is tracked: don't plan or track work there.

## Conventions

Paths below are relative to the vault root.

- **Work item**: one file `W-NNNN <Title>.md` under `work/`, copied from `templates/Work item.md`. Take the next free `W-NNNN`. The hierarchy comes from the `parent` property, and the folders under `work/` mirror it: an item with children is a folder of the same name holding its own note and its children, and an item without children is a plain file in its parent's folder. Don't place or move files by hand. Set `parent`, then run `python3 tools/tree.py --fix-layout` (see the vault's `AGENTS.md` → Work item layout).
- **Create an issue**: create a work item. Set `parent` to the closest theme (see `python3 tools/tree.py`), and set `status: todo`, `kind` and a clear Goal.
- **Labels**: there are no labels. Old GitHub labels map to properties: `bug` / `Feature` / `Improvement` / `refactor` / `Infra` → `kind`; `frontend` / `backend` → `scope` (comma separated, also `contracts`). Triage roles go in `triage` (see `docs/agents/triage-labels.md`).
- **Make an issue a sub-issue of a parent**: set the child's `parent` to the parent work item's wikilink, e.g. `parent: "[[W-0011 Failed Add Data Paste Report]]"`. Use `order` to sequence siblings, then run `python3 tools/tree.py --fix-layout` to move the files.
- **Read an issue**: read the work item top to bottom (including its Log), every note linked under Context, and the ancestors' Goals.
- **List issues**: `python3 tools/tree.py --open` lists open work, with each item's `triage` value in braces. Add `--root W-NNNN` for one subtree.
- **Comment on an issue**: add a dated line to the item's `## Log`, as `- YYYY-MM-DD: …`.
- **Start**: set `status: doing` and add a Log line.
- **Close**: set `status: done` and `done: <date>`, add a final Log line, then run `python3 tools/tree.py --fix-layout`. It adds ` ✅` to the item's name and rewrites the links to it (see the vault's `AGENTS.md` → Work item names). Set `release` once it reaches production.
- **Specs**: PRDs go in `docs/PRD - <title>.md` and ADR copies go in `docs/ADR-NNNN <title>.md`. Link them from the work item's Context.
- **Branches**: `w/<NNNN>`, the work item's number (e.g. `w/0026` for W-0026). Always cut from `dev`, in its own worktree at `.claude/worktrees/w-<NNNN>` (see `AGENTS.md` → Branching). Older branches were `issue/<n>` and `linear/SPE-<n>`.
- **Commits**: name the item in the subject, e.g. `fix(frontend): … (W-0026)`.
- **PRs**: open with `--base dev` and put the work item ID in the title or body. Merging does not close anything, so close the item in the vault by hand.
- **Validate**: run `python3 tools/tree.py --check` after editing the vault. Commit vault changes in the vault repo, with a message that names the W-ids touched.

## Pull requests as a triage surface

**PRs as a request surface: no.** External PRs are not triaged as feature requests.

## When a skill says "publish to the issue tracker"

Create a work item in the vault (or a PRD in `docs/` for a spec, with a work item that links it).

## When a skill says "fetch the relevant ticket"

Read the work item (`find work -name 'W-NNNN *.md'`). Given an old `SPE-<n>` or `#<n>`, find it by its `source` property.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a root (or parent) work item, and its **child** work items are the tickets.

- **Map**: a work item whose Goal and Log hold the Notes, Decisions-so-far and Fog.
- **Child ticket**: a work item with `parent` set to the map. Use `order` for map order.
- **Blocking**: set the child's `status: blocked`, with a last Log line `Blocked by [[W-NNNN …]]`. A ticket is unblocked when every blocker it names is `done` or `dropped`. Then set it back to `todo`.
- **Frontier query**: `python3 tools/tree.py --open --root W-NNNN`. Skip `blocked` and `doing` children. The first `todo` child in `order` wins.
- **Claim**: set the child to `doing` and add a Log line. This is the session's first write.
- **Resolve**: add the answer to the child's Log, close it, then add a pointer (gist + `[[link]]`) to the map's Log under Decisions-so-far.
