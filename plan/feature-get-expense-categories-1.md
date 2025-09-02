---
goal: Create Get Expense Categories endpoint (getExpenseCategories)
version: 1.0
date_created: 2025-09-02
last_updated: 2025-09-02
owner: backend-team
status: 'Planned'
tags: ['feature', 'expense-category', 'backend']
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This document is a deterministic, machine-parseable implementation plan to add a new backend API endpoint named getExpenseCategories. It prescribes the exact files, function names, data shapes, validations, and tests required. Each phase contains atomic tasks with measurable completion criteria so human developers or automated agents can execute without additional interpretation.

## 1. Requirements & Constraints

- **REQ-001**: Add a GET endpoint `/getexpensecategories` registered in `packages/backend/src/server.ts` that is handled by `getExpenseCategoriesHandler`.
- **REQ-002**: Handler must call validation function `validateGetExpenseCategoriesInput` and then call service function `getExpenseCategoriesService`.
- **REQ-003**: Validation schema fields: `userId` (uuid), `accountId` (uuid). Both are required query parameters for the endpoint. (Optional filter fields may be added later as separate tasks.)
- **REQ-004**: Service accepts an input type identical to the Zod parse result and returns an array of domain `ExpenseCategory` objects.
- **REQ-005**: Repository function `getExpenseCategoriesRepository` must query the `expense_categories` table (see `packages/backend/src/db/schema.ts`) using Drizzle ORM and return the selected rows.
- **REQ-006**: A mapper utility `dbExpenseCategoriesToDomainCategories` must be used to convert each Drizzle row into a domain `ExpenseCategory` object before returning from the service.
- **REQ-007**: On failures, handler must set HTTP status using `errorStatusMapper` (`packages/backend/src/utilities/errorStatusMapper.ts`) and set `ctx.body` to an object with an `error` property containing a human-readable message.
- **REQ-008**: Follow the existing `expenseCategories` domain structure under `packages/backend/src/expenseCategories` as it already exists in the repository.
- **SEC-001**: No network calls outside the local project during implementation; tests should use mocks where appropriate.
- **CON-001**: Use TypeScript and existing project conventions (no default exports, named exports only).
- **GUD-001**: Add Jest unit tests for validation, service, repository, and handler
- **PAT-001**: Identifier prefixes: all new task identifiers and references use the prefixes defined in this plan (e.g., REQ-, TASK-, FILE-).

Assumptions (explicit):

- **ASSUMPTION-001**: `expense_categories` schema in `packages/backend/src/db/schema.ts` includes columns `userId`, `accountId`, `name`, `subcategories`, `createdAt`, `updatedAt`.
- **ASSUMPTION-002**: A generic `db` export and Drizzle client exist in `packages/backend/src/db/index.ts` and can be imported by repository code.
- **ASSUMPTION-003**: The mapper `dbExpenseCategoriesToDomainCategories` does not currently exist and must be created at `packages/backend/src/utilities/mappers/dbExpenseCategoriesToDomainCategories.ts` as part of this plan.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Add validation and handler wiring.

| Task     | Description                                                                                                                                                                                                                                                                                                       | Completed | Date |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-101 | Update `models.ts` to export `GetExpenseCategoriesInputSchema` (Zod) and `GetExpenseCategoriesInput` type under `packages/backend/src/expenseCategories/validation`, and create `getExpenseCategoriesValidation.ts` which exports `validateGetExpenseCategoriesInput` that parses and rethrows validation errors. |           |      |
| TASK-102 | Create `getExpenseCategoriesHandler.ts` that imports the schema, validates input, calls `getExpenseCategoriesService`, and handles success/error using `errorStatusMapper` under `packages/backend/src/expenseCategories/handler`.                                                                                |           |      |
| TASK-103 | Update `packages/backend/src/expenseCategories/handler/index.ts` to export the new handler.                                                                                                                                                                                                                       |           |      |
| TASK-104 | Update `packages/backend/src/server.ts` to register the GET route `/getexpensecategories` to `getExpenseCategoriesHandler`.                                                                                                                                                                                       |           |      |

Detailed tasks (atomic):

- TASK-101 details:
  - Files to create/update:
    - `packages/backend/src/expenseCategories/validation/models.ts` — define and export `GetExpenseCategoriesInputSchema` (Zod) and `GetExpenseCategoriesInput` type.
    - `packages/backend/src/expenseCategories/validation/getExpenseCategoriesValidation.ts` — export `validateGetExpenseCategoriesInput(input: unknown): asserts input is GetExpenseCategoriesInput` which calls `GetExpenseCategoriesInputSchema.parse(input)` inside a try/catch and on error throws `ValidationError` with the Zod issue message (mirror implementation in `createExpenseCategoryValidation.ts`).
  - Schema details (to be placed in `models.ts`):
    - Use existing schema fragments from `packages/backend/src/expenseCategories/validation/validationUtils` for `userId` and `accountId` (to reuse correct error strings and structure).
    - `GetExpenseCategoriesInputSchema` must require:
      - `userId`: userId schema fragment
      - `accountId`: accountId schema fragment
    - Export `type GetExpenseCategoriesInput = z.infer<typeof GetExpenseCategoriesInputSchema>`.
  - Validation function behavior (`getExpenseCategoriesValidation.ts`):
    - Implement `validateGetExpenseCategoriesInput(input: unknown)` that calls `GetExpenseCategoriesInputSchema.parse(input)` and, on Zod error, throws a `ValidationError` with the first issue message (same pattern as `createExpenseCategoryValidation.ts`).
  - Tests (unit test structure to add in `packages/backend/src/expenseCategories/__tests__/validation/getExpenseCategoriesValidation.test.ts`):
    - Use Jest with the repo's existing patterns. Tests should assert:
      - valid query with proper UUID strings parses (i.e., calling `validateGetExpenseCategoriesInput` does not throw) and type guard works.
      - missing or invalid `userId`/`accountId` cause `validateGetExpenseCategoriesInput` to throw `ValidationError` and the thrown message equals expected validation constants from `validationUtils`/`models/errors/validationError.ts`.
  - Completion criteria: `models.ts` and `getExpenseCategoriesValidation.ts` exist; validation function parses valid input and rethrows `ValidationError` on invalid input.

- TASK-102 details (file: `packages/backend/src/expenseCategories/handler/getExpenseCategoriesHandler.ts`):
  - Function signature: `export async function getExpenseCategoriesHandler(ctx: Koa.Context): Promise<void>`
  - Behavior:
  1. Validate input by calling `validateGetExpenseCategoriesInput(ctx.request.query)` imported from `../validation/getExpenseCategoriesValidation` inside a try/catch. The handler MUST NOT call `GetExpenseCategoriesInputSchema.parse` directly; it should rely on the validation helper to assert the type or throw a `ValidationError`.
  2. On success, call `getExpenseCategoriesService(validated)` and set `ctx.status = 200` and `ctx.body = { expenseCategories: result }`.
  3. On error, determine status `const status = errorStatusMapper(error)` and set `ctx.status = status` and `ctx.body = { error: error instanceof Error ? error.message : String(error) }`.
  - Imports:
    - `validateGetExpenseCategoriesInput` from `../validation/getExpenseCategoriesValidation`
    - `getExpenseCategoriesService` from `../service/getExpenseCategoriesService`
    - `errorStatusMapper` from `../../utilities/errorStatusMapper`
  - Tests (unit test structure to add in `packages/backend/src/expenseCategories/__tests__/handler/getExpenseCategoriesHandler.test.ts`):
    - Happy path:
      - Mock `getExpenseCategoriesService` to return an array of mapped expenseCategory objects.
      - Invoke handler with a valid `ctx.request.query` and assert `ctx.status === 200` and `ctx.body.expenseCategories` equals the mocked array.
    - Failure path(s):
      - Simulate validation error and service error (mock validation helper to throw `ValidationError`, and mock service to throw).
      - Invoke handler and assert `ctx.status !== 200` and `ctx.body.error` is a non-empty string.
  - Completion criteria: Handler file compiles and unit tests cover the happy path (200 + body) and failure paths (non-200 status + error message present).

- TASK-103 details (file: `packages/backend/src/expenseCategories/handler/index.ts`):
  - Add named export: `export { getExpenseCategoriesHandler } from './getExpenseCategoriesHandler'`
  - Completion criteria: `handler` barrel exports new handler and existing imports in `server.ts` can destructure it.

- TASK-104 details (file: `packages/backend/src/server.ts`):
  - Add import in existing import block: include `getExpenseCategoriesHandler` from `./expenseCategories/handler`.
  - Add router registration: `router.get('/getexpensecategories', getExpenseCategoriesHandler)` directly after the existing `getexpense` route registration (or next to similar routes).
  - Completion criteria: Server compiles and route is registered.

### Checkpoint 1

Checkpoint conditions: After Phase 1 tasks complete, ensure TypeScript compile passes and unit tests for validation and handler (created in Phase 1) pass locally.

### Implementation Phase 2

- GOAL-002: Implement service, repository wiring, and map results.

| Task     | Description                                                                                                                      | Completed | Date |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-105 | Create `getExpenseCategoriesService.ts` that performs business logic and calls repository.                                       |           |      |
| TASK-106 | Create `getExpenseCategoriesRepository.ts` which queries using Drizzle and returns the selected rows.                            |           |      |
| TASK-107 | Ensure mapper `dbExpenseCategoriesToDomainCategories.ts` is used to convert DB rows into domain objects (reuse existing mapper). |           |      |
| TASK-108 | Update `packages/backend/src/expenseCategories/repository/index.ts` and `service/index.ts` barrel files to export new functions. |           |      |

Detailed tasks:

- TASK-105 details (file: `packages/backend/src/expenseCategories/service/getExpenseCategoriesService.ts`):
  - Exported function:
    - `export async function getExpenseCategoriesService(input: GetExpenseCategoriesInput): Promise<ExpenseCategory[]>`
  - `ExpenseCategory` is a domain type; import from `packages/backend/src/expenseCategories/models`
  - Behavior:
    1. Build repository filters from input: `{ accountId: input.accountId }`.
    2. Call repository `getExpenseCategoriesRepository(filters)` which returns `ExpenseCategory[]` (repository is responsible for mapping DB rows to domain objects using `dbExpenseCategoriesToDomainCategories`).
  3. Return the array received from the repository unchanged.
  - Completion criteria: Service returns mapped array for a successful repository query; errors are thrown upward.

- TASK-106 details (file: `packages/backend/src/expenseCategories/repository/getExpenseCategoriesRepository.ts`):
  - Exported function signature:
    - `export async function getExpenseCategoriesRepository(filters: { accountId: string }): Promise<ExpenseCategory[]>`
  - Implementation:
    1. Import `db` client and `expenseCategories` table definition from `packages/backend/src/db/schema.ts`.
    2. Use Drizzle select pattern to query rows matching `userId` and `accountId`. Example (pseudocode consistent with existing Drizzle usage in repo):
  - `const rows = await db.select().from(expenseCategoriesTable).where(eq(expenseCategoriesTable.accountId, filters.accountId)).all();`
    - If the project's Drizzle API differs, implement equivalent select to return an array of rows.
  3. Map each DB row using `dbExpenseCategoriesToDomainCategories` and return the resulting `ExpenseCategory[]`.
  - Completion criteria: Repository compiles and unit tests using the premade DB mock at `packages/backend/src/db/__mocks__/index.ts` verify that the correct query/filter values are used and that returned rows are forwarded.

-- TASK-107 details (file: `packages/backend/src/utilities/mappers/dbExpenseCategoriesToDomainCategories.ts`):

- Exported function (if not already present): `export function dbExpenseCategoriesToDomainCategories(row: ExpensesCategoryDbRow): ExpenseCategory`
- Mapping rules:
  - `userId` and `accountId` remain strings (UUIDs) in domain object.
  - `name` is string.
  - `subcategories` normalize to `string[]` (if DB returns JSON, parse or map accordingly).
  - `createdAt` and `updatedAt` map to ISO strings (use `row.createdAt.toISOString()` if `Date` objects are returned by DB client).
- Completion criteria: Mapper has explicit type annotations and a unit test verifying expected mapping.

- TASK-108 details (files: `packages/backend/src/expenseCategories/repository/index.ts`, `packages/backend/src/expenseCategories/service/index.ts`):
  - Add named exports for the new functions.
  - Completion criteria: Barrel exports updated and import paths in service/handler resolve.

### Checkpoint 2

Checkpoint conditions: After Phase 2, run TypeScript compile, run repository & service unit tests; ensure passing tests for retrieval flow with mocked db and mapper.

## 4. Dependencies

- **DEP-001**: Drizzle ORM (already present in repo).
- **DEP-002**: Zod (already present in repo).
- **DEP-003**: Jest (for tests), and any existing test setup in `packages/backend/jest.config.js`.

## 5. Files

- **FILE-101**: `packages/backend/src/expenseCategories/validation/getExpenseCategoriesValidation.ts` — validation wrapper which calls `GetExpenseCategoriesInputSchema.parse` and rethrows `ValidationError`
- **FILE-102**: `packages/backend/src/expenseCategories/handler/getExpenseCategoriesHandler.ts` — Koa handler
- **FILE-103**: `packages/backend/src/expenseCategories/handler/index.ts` — update export
- **FILE-104**: `packages/backend/src/server.ts` — register route `/getexpensecategories`
- **FILE-105**: `packages/backend/src/expenseCategories/service/getExpenseCategoriesService.ts` — service business logic
- **FILE-106**: `packages/backend/src/expenseCategories/service/index.ts` — update barrel export
- **FILE-107**: `packages/backend/src/expenseCategories/repository/getExpenseCategoriesRepository.ts` — Drizzle select
- **FILE-108**: `packages/backend/src/expenseCategories/repository/index.ts` — update barrel export
- **FILE-109**: `packages/backend/src/utilities/mappers/dbExpenseCategoriesToDomainCategories.ts` — mapper utility (create as part of this plan)
- **FILE-110**: `packages/backend/src/expenseCategories/__tests__/handler/getExpenseCategoriesHandler.test.ts` — handler tests
- **FILE-111**: `packages/backend/src/expenseCategories/__tests__/service/getExpenseCategoriesService.test.ts` — service tests
- **FILE-112**: `packages/backend/src/expenseCategories/__tests__/repository/getExpenseCategoriesRepository.test.ts` — repository tests
- **FILE-113**: `packages/backend/src/expenseCategories/__tests__/validation/getExpenseCategoriesValidation.test.ts` — validation tests

## 6. Testing

- **TEST-101**: Validation tests (file: FILE-113):
  - When valid query provided, `GetExpenseCategoriesSchema.parse` should return typed object.
  - When invalid query provided (missing `userId` or `accountId`), should throw `ValidationError`. Tests must follow existing describe/it conventions.

- **TEST-102**: Repository tests (file: FILE-112):
  - Use the premade DB mock (`packages/backend/src/db/__mocks__/index.ts`) to simulate `db.select().from(...).where(...).all()` and verify it is called with correct filter values.
  - Assert repository returns the rows from the mocked DB call.

- **TEST-103**: Service tests (file: FILE-111):
  - Mock repository to return DB rows; verify service calls `dbExpenseCategoriesToDomainCategories` and returns an array of domain objects.
  - Edge: repository throws `RepositoryError` and service rethrows.

- **TEST-104**: Handler tests (file: FILE-110):
  - Happy path: mock `getExpenseCategoriesService` to return an array; assert handler sets `ctx.status === 200` and `ctx.body.expenseCategories` equals mocked array.
  - Invalid input: cause validation parse to throw; assert handler uses `errorStatusMapper` to set non-200 status and includes error message in `ctx.body.error`.

Test run criteria: All new tests listed pass locally in `packages/backend` test runner.

## 7. Risks & Assumptions

- **RISK-001**: Schema mismatch: `expense_categories` table in `schema.ts` may have different column names or types; repository implementation must be adjusted to match actual schema.
- **ASSUMPTION-002**: Drizzle's select API returns rows in a format compatible with `dbExpenseCategoriesToDomainCategories`.

## 8. Related Specifications / Further Reading

- `packages/backend/src/db/schema.ts` (expenseCategories table definition)
- `packages/backend/src/utilities/errorStatusMapper.ts`
- Example handlers and tests in `packages/backend/src/expenseCategories/*` to mirror patterns

---

Validation checklist (explicit):

- [ ] REQ-001: Server route added and handler wired
- [ ] REQ-002/REQ-003: Zod validation added and tested
- [ ] REQ-004: Service implemented and typed
- [ ] REQ-005: Repository queries DB using Drizzle
- [ ] REQ-006: Mapper used to convert DB rows
- [ ] REQ-007: Error mapping via `errorStatusMapper` implemented in handler
- [ ] GUD-001: Tests added for validation, repository, service, handler

Quality gates (actions to run after implementation):

- TypeScript compile: run from `packages/backend` (e.g., `npm run build` or `tsc --noEmit`).
- Lint: run existing linting for backend package.
- Unit tests: `npm test` within `packages/backend` or run Jest on created test files.
- Smoke test: start backend (`npm run dev`) and GET `/getexpensecategories?userId=<uuid>&accountId=<uuid>` and verify 200 response and returned array.

Validation criteria (automatable):

- Each TASK-10X marked Completed only when:
  - File exists at the specified path.
  - File exports the named symbol(s) exactly as specified.
  - Corresponding unit tests for that file pass.

End of plan.
