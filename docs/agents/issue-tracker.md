# Issue tracker: Linear

Issues and specs for this repo live in Linear, team **SpendTrend** (identifier prefix `SPE`, e.g. `SPE-120`).
Use the Linear MCP tools (`mcp__claude_ai_Linear__*`) for all operations; there is no CLI.
GitHub (`nikitasheremet/SpendTrend`) hosts code and PRs only — do not create GitHub issues.

## Conventions

- **Create an issue**: `save_issue` with `team: "SpendTrend"`, `title`, `description` (Markdown, literal newlines).
  Add area/type labels where they fit: `frontend` / `backend` / `Infra`, and `Bug` / `Feature` / `Improvement` / `refactor`.
- **Read an issue**: `get_issue` with the identifier (`SPE-123`), then `list_comments` for the discussion.
- **List issues**: `list_issues` with `team: "SpendTrend"` plus `label` / `state` / `assignee` filters.
- **Comment**: `save_comment` on the issue.
- **Apply / remove labels**: `save_issue` with `id` and `addLabels` / `removeLabels` (never `labels`, which replaces the whole set).
  Create a missing label with `create_issue_label` on first use.
- **Close**: comment first, then `save_issue` with `state: "Done"` (completed) or `state: "Canceled"` (won't do).
- **Workflow states**: Backlog → Todo → In Progress → In Review → Review Completed → Done (also Canceled, Duplicate).
- **Branches**: name branches `linear/SPE-<n>` and reference `(SPE-<n>)` in commit subjects, matching existing history.

## When a skill says "publish to the issue tracker"

Create a Linear issue in the SpendTrend team.

## When a skill says "fetch the relevant ticket"

`get_issue` with the `SPE-<n>` identifier, plus `list_comments`.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a parent issue with **sub-issues** as tickets.

- **Map**: an issue labelled `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body.
- **Child ticket**: a sub-issue (`save_issue` with `parentId: "<map>"`), labelled `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`).
- **Blocking**: Linear's native relations — `save_issue` with `blockedBy: ["SPE-<n>"]`. A ticket is unblocked when every blocker is Done/Canceled.
- **Frontier query**: `list_issues` with `parentId: "<map>"`, drop completed/canceled, assigned, or blocked-by-open issues; first in map order wins.
- **Claim**: `save_issue` with `assignee: "me"` and `state: "In Progress"`, the session's first write.
- **Resolve**: `save_comment` with the answer, `save_issue` with `state: "Done"`, then append a context pointer (gist + link) to the map's Decisions-so-far (`save_issue` with `patch` → `append`).
