---
name: mapChangesMade
description: Produce a visual map of how the files changed so far in this session fit together — component/prop hierarchy, data/runtime flow, and a file index with each file's role. Use when the user is getting lost in a multi-file change and wants to see the big picture.
---

# Map Changes Made

Produce a "you are here" map of the changes made so far in the current session (or, if the
user specifies a commit range/branch, of that diff instead). The goal is to help the user
re-orient across a multi-file change, not to re-explain individual diffs line-by-line.

## How to gather the change set

1. Default to the files touched in this conversation so far (edits/writes you made).
2. If the user references commits/a branch instead, use `git diff <range> --stat` /
   `git log` to enumerate the changed files.
3. Don't include incidental files (lockfiles, generated output) in the diagrams below
   unless they're central to the change.

## What to produce

Build whichever of these sections are relevant to the change — skip ones that don't apply
rather than forcing every change into all three shapes:

1. **Hierarchy / call graph** — if the change threads a prop, value, or dependency through
   several files (e.g. parent component → child → child → leaf), draw that chain as a tree
   showing which files are pure pass-throughs vs. where the real logic lives (compute vs.
   consume).

2. **Runtime data flow** — if the change involves computed/derived values, hooks, or
   reactive state flowing between files, draw an arrow-diagram: `source file ──► value
   ──► where it's consumed ──► what it controls`. Name the actual variables/functions
   involved so it's grep-able.

3. **Visual/spatial layout** — if the change affects UI layout, stacking, or positioning
   (z-index, sticky elements, layout regions), draw an ASCII box diagram of how the pieces
   stack or sit relative to each other on screen, annotated with the relevant
   classes/values from the code.

4. **File index table** — always include a compact table: `| File | Role |` — one row per
   changed file, each role described in terms of the diagrams above (e.g. "owns the
   computation", "pure pass-through", "consumes the value and applies styling").

## Style notes

- Use real file paths (relative to repo root) and real identifier names from the code —
  this should be grep-able/navigable, not abstract.
- Keep diagrams plain ASCII (box-drawing characters are fine) so they render in a terminal.
- Be concise — this is a map, not documentation. Prefer diagrams over prose.
- If a helper/hook is shared with other parts of the codebase beyond this change, note
  what else uses it, but don't deep-dive into unrelated call sites.
