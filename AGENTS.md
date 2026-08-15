# AGENTS.md

Instructions for any AI coding agent (Claude, Codex, etc.) working in this repository.

## Repo structure

npm workspaces monorepo:
- `packages/frontend` — Vue 3 app
- `packages/backend` — Koa/Hono API, Drizzle ORM (Postgres)
- `contracts` — shared TypeScript types built via `tsc -b`

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
- Testing: Vitest + `@vue/test-utils` (`mount`). No Jest, no React Testing
  Library.
- Verify with `npm run type-check` (`vue-tsc --noEmit`) in
  `packages/frontend`, and `npx vitest run` for unit tests.

## Backend (`packages/backend`)

- `npm run types:lint` (`tsc --noEmit && eslint .`) for type/lint checks.
- `npm run test:unit` (Vitest) and `npm run test:e2e` (Playwright) for tests.

## Verification defaults

Prefer type-checking and unit tests over starting a dev server or opening a
browser to verify behavior, unless a task explicitly asks for browser-based
verification. Some tickets explicitly forbid running the app locally — treat
that as the default posture unless told otherwise.
