# AGENTS.md

Instructions for any AI coding agent (Claude, Codex, etc.) working in this repository.

## Repo structure

npm workspaces monorepo:
- `packages/frontend` — Vue 3 app
- `packages/backend` — Koa/Hono API, Drizzle ORM (Postgres)
- `contracts` — shared TypeScript types built via `tsc -b`

## Branching

Start every change on a fresh branch cut from `dev` (naming in
`docs/agents/issue-tracker.md`) and open the PR back into `dev`. This holds even
when a skill or workflow says to commit to the current branch. Commit directly
to `dev` only when the user explicitly asks for that.

Do every piece of new work in its own git worktree, not in the main checkout.
Other agents and the user may have uncommitted changes there. Create the
worktree and branch together from the latest `dev`:

```sh
git fetch origin
git worktree add -b w/<NNNN> .claude/worktrees/w-<NNNN> origin/dev
cd .claude/worktrees/w-<NNNN> && npm install
```

Run every command for that work from inside the worktree. Never switch
branches, stash or reset in the main checkout. After the PR merges, remove the
worktree from the main checkout with `npm run worktree:remove -- <NNNN>`, which
also stops its servers and drops its local database.

## Code ordering: newspaper style

Order declarations so a reader hits the important thing first and the supporting
detail after, the way a newspaper article leads with the headline:

- **Functions**: declare the main exported function/entry point first, then its
  private helper functions below it, in roughly the order the main function
  calls them. This relies on JavaScript's function-declaration hoisting, so a
  helper referenced above its own definition still resolves correctly at call
  time.
- **Consts**: `const` is **not** hoisted (temporal dead zone), so any `const`
  referenced inside a function above it must be declared *before* that
  function, not after. Do not rely on hoisting for consts the way you can for
  function declarations.

## Frontend (`packages/frontend`)

- Vue 3 `<script setup lang="ts">`, using Vue 3.5's reactive props destructure
  (`const { foo } = defineProps<{...}>()`) instead of `withDefaults`.
- Generic components use `<script setup lang="ts" generic="T extends ...">`.
- Composables that transform table row data follow the
  `{ row: T; index: number }[]` in/out contract (see `useTableFilters` /
  `useTableSort`) so original row indices survive filter/sort pipelines.
- Testing: Vitest + `@testing-library/vue` (`render`, `screen`) with
  `@testing-library/user-event` for interactions. Query by what the user sees
  (role, label, text) rather than CSS selectors or component internals. Older
  tests use `@vue/test-utils` (`mount`); don't add new ones in that style. No
  Jest.
- Verify with `npm run type-check` (`vue-tsc --noEmit`) in
  `packages/frontend`, and `npx vitest run` for unit tests.

## Backend (`packages/backend`)

- `npm run types:lint` (`tsc --noEmit && eslint .`) for type/lint checks.
- `npm run test:unit` (Vitest) and `npm run test:e2e` (Playwright) for tests.

## Verification defaults

Every change gets type-check and unit tests. Two kinds of change also get
**local verification** against the running app:

- **User-facing frontend changes**: click through the changed flows in a
  headless browser.
- **New or changed endpoints**: call them with curl against the real local DB.

Pure refactors stop at type-check and unit tests, and so does
any work item that says not to run the app.

The local verification flow, run from the worktree (details, an example script
and gotchas in `docs/agents/local-verification.md`):

1. `npm run agent:up` starts this worktree's DB, backend and frontend on its own
   ports and prints the URLs.
2. `npm run local:signin -w packages/backend` signs in as the local user and
   writes a Playwright storage state and a curl cookie jar.
3. Drive the frontend with an ad-hoc headless Playwright script in
   `.agent-scratch/` (gitignored), and call endpoints with
   `curl -b packages/backend/.agent-auth/cookies.txt`.
4. `npm run agent:down` stops the servers.
5. Add a **Verified locally** section to the PR body listing each flow clicked
   and endpoint called, with its result.

## Agent skills

### Issue tracker

Work is planned and tracked in the spend_trend Obsidian vault (`~/Documents/vaults/spend_trend`) as `W-NNNN` work items, not in GitHub Issues or Linear. Read the vault's `AGENTS.md` before editing it. See `docs/agents/issue-tracker.md`.

### Triage labels

The five triage roles map to the vault work item `triage` property (`wontfix` is `status: dropped`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one root `GLOSSARY.md` + `docs/adr/`. See `docs/agents/domain.md`.
