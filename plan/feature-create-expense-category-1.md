---
goal: Create Expense Category endpoint (createExpenseCategory)
version: 1.0
date_created: 2025-09-01
last_updated: 2025-09-01
owner: backend-team
status: 'Planned'
tags: ['feature', 'expense-category', 'backend']
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This document is a deterministic, machine-parseable implementation plan to add a new backend API endpoint named createExpenseCategory. It prescribes the exact files, function names, data shapes, validations, and tests required. Each phase contains atomic tasks with measurable completion criteria so human developers or automated agents can execute without additional interpretation.

## 1. Requirements & Constraints

- **REQ-001**: Add a POST endpoint `/createexpensecategory` registered in `packages/backend/src/server.ts` that is handled by `createExpenseCategoryHandler`.
- **REQ-002**: Handler must validate input using a Zod schema and then call service function `createExpenseCategoryService`.
- **REQ-003**: Validation schema fields: `userId` (uuid), `accountId` (uuid), `name` (non-empty string), `subcategories` (array of strings, required but may be empty).
- **REQ-004**: Service accepts an input type identical to the Zod parse result and returns a domain expenseCategory object.
- **REQ-005**: Repository function `createExpenseCategoryRepository` must insert a row into the `expense_categories` table (see `packages/backend/src/db/schema.ts`) using Drizzle ORM and return the inserted row.
- **REQ-006**: After insertion, a mapper utility `mapExpenseCategoryFromDb` must convert the Drizzle row into a domain expenseCategory object.
- **REQ-007**: On failures, handler must set HTTP status using `errorStatusMapper` (`packages/backend/src/utilities/errorStatusMapper.ts`) and set `ctx.body` to an object with an `error` property containing a human-readable message.
- **REQ-008**: Follow the file/folder structure used by the existing `expense` feature under `packages/backend/src/expense`.
- **SEC-001**: No network calls outside the local project during implementation; tests should use mocks where appropriate.
- **CON-001**: Use TypeScript and existing project conventions (no default exports, named exports only).
- **GUD-001**: Add Jest unit tests for validation, service, repository, and handler (happy path + at least one error path each).
- **PAT-001**: Identifier prefixes: all new task identifiers and references use the prefixes defined in this plan (e.g., REQ-, TASK-, FILE-).

Assumptions (explicit):

- **ASSUMPTION-001**: `expense_categories` schema in `packages/backend/src/db/schema.ts` uses UUID types for `userId` and `accountId` (this plan uses `string` in TypeScript for those fields and validates as UUIDs).
- **ASSUMPTION-002**: A generic `db` export and Drizzle client exist in `packages/backend/src/db/index.ts` and can be imported by repository code.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Add validation and handler wiring.

| Task     | Description                                                                                                                                                                                                                          | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-000 | Create directory structure for `expenseCategories` domain mirroring the existing `expense` domain.                                                                                                                                   |           |      |
| TASK-001 | Create `createExpenseCategoryValidation.ts` that exports `CreateExpenseCategorySchema` (Zod) and `CreateExpenseCategoryInput` TypeScript type under `packages/backend/src/expenseCategories/validation`.                             |           |      |
| TASK-002 | Create `createExpenseCategoryHandler.ts` that imports the schema, validates input, calls `createExpenseCategoryService`, and handles success/error using `errorStatusMapper` under `packages/backend/src/expenseCategories/handler`. |           |      |
| TASK-003 | Update `packages/backend/src/expenseCategories/handler/index.ts` to export the new handler.                                                                                                                                          |           |      |
| TASK-004 | Update `packages/backend/src/server.ts` to register the POST route `/createexpensecategory` to `createExpenseCategoryHandler`.                                                                                                       |           |      |

Detailed tasks (atomic):

- TASK-000 details (file system):
  - Purpose: create the directory and subdirectory layout for the `expenseCategories` domain so new files can be added following existing project conventions.
  - Directories to create (each path is relative to repository root):
    - `packages/backend/src/expenseCategories/`
    - `packages/backend/src/expenseCategories/__tests__/`
    - `packages/backend/src/expenseCategories/__tests__/handler/`
    - `packages/backend/src/expenseCategories/__tests__/repository/`
    - `packages/backend/src/expenseCategories/__tests__/service/`
    - `packages/backend/src/expenseCategories/__tests__/validation/`
    - `packages/backend/src/expenseCategories/handler/`
    - `packages/backend/src/expenseCategories/repository/`
    - `packages/backend/src/expenseCategories/service/`
    - `packages/backend/src/expenseCategories/validation/`
    - `packages/backend/src/expenseCategories/validation/validationUtils/`
    - `packages/backend/src/expenseCategories/models.ts` (file will be added later but directory path is listed here)
  - Notes:
    - The directory names mirror the existing `packages/backend/src/expense` structure exactly, with the domain folder renamed to `expenseCategories`.
    - `utilities/mappers` already exists; map file for expenseCategories will be placed at `packages/backend/src/utilities/mappers/mapExpenseCategoryFromDb.ts` (file creation is part of Phase 2).
  - Completion criteria:
    - All directories listed above exist in the repository.
    - Checkpoint 0 - Confirm with developer that the file structure is correct before proceeding

- TASK-001 details (file: `packages/backend/src/expenseCategories/validation/createExpenseCategoryValidation.ts`):
- Exports:
  - named export `CreateExpenseCategorySchema` (Zod object) with fields:
  - `userId`: z.uuid()
  - `accountId`: z.uuid()
- `name`: z.string().min(1)
  - `subcategories`: z.array(z.string().min(1))
  - named export `CreateExpenseCategoryInput` = z.infer<typeof CreateExpenseCategorySchema>
- Validation must throw a `ValidationError` (existing project error type) when parse fails. If `ValidationError` is not currently imported location is `packages/backend/src/models/errors/validationError.ts` (assumed). The file must only export the schema and types; throwing `ValidationError` will be handled by handler when calling parse.
- Completion criteria: File created and `CreateExpenseCategorySchema.parse` returns a typed object for a valid payload, and a test verifies parse failure returns/throws expected ValidationError type.

- Tests (unit test structure to add in `packages/backend/src/expenseCategories/__tests__/validation/createExpenseCategoryValidation.test.ts`):
  - Test framework: Jest using existing patterns in the repo. Each field gets its own `describe` block.
  - `describe('when userId is provided')`:
    - it('should exist in the parsed output') — assert parsed object has `userId` property.
    - it('should be a valid UUID string') — pass invalid UUIDs and expect parse to throw.
    - it('should not be an empty string') — pass `""` and expect parse to throw.
  - `describe('when accountId is provided')`:
    - it('should exist in the parsed output')
    - it('should be a valid UUID string')
    - it('should not be an empty string')
  - `describe('when name is provided')`:
    - it('should exist in the parsed output')
- it('should be a string')
- it('should not be an empty string')
  - `describe('when subcategories is provided')`:
    - it('should exist in the parsed output') — assert property present after parse (the schema will default missing to []).
    - it('should be an array of strings') — non-array should cause parse to throw.
    - it('may be an empty array') — assert that `[]` is accepted.
    - it('each item should be a non-empty string') — invalid items should cause parse to throw.
    - Negative test cases: for each field add tests that invalid/missing values cause the schema to throw a `ValidationError` and the thrown error message MUST match the project's validation error constant (imported from `packages/backend/src/models/errors/validationError.ts`). Use the following mapping when asserting messages:
      - `userId` missing -> `VALIDATION_ERROR_USERID_MISSING`
      - `userId` empty string -> `VALIDATION_ERROR_USERID_EMPTY`
      - `userId` wrong type -> `VALIDATION_ERROR_USERID_TYPE`
      - `accountId` missing -> `VALIDATION_ERROR_ACCOUNTID_MISSING`
      - `accountId` empty string -> `VALIDATION_ERROR_ACCOUNTID_EMPTY`
      - `accountId` wrong type -> `VALIDATION_ERROR_ACCOUNTID_TYPE`
      - `name` missing -> `VALIDATION_ERROR_NAME_IS_REQUIRED`
      - `name` wrong type -> `VALIDATION_ERROR_NAME_MUST_BE_STRING`
      - `name` empty string -> `VALIDATION_ERROR_NAME_EMPTY`
      - `subcategories` missing (if you choose to treat missing differently) -> `VALIDATION_ERROR_SUBCATEGORY_MISSING`
      - `subcategories` wrong type or items wrong type -> `VALIDATION_ERROR_SUBCATEGORY_TYPE`
    - Implementation note: Tests should import `ValidationError` and the constants and assert both that a `ValidationError` is thrown and that the thrown message equals the expected constant string (use `toThrow(ValidationError)` and `toThrow(EXPECTED_CONSTANT)`).
    - Completion criteria for tests: Tests exist, follow the project's describe/it naming conventions, and cover existence, type, and non-emptiness checks (with `subcategories` explicitly allowed to be empty but must be an array). Error messages are asserted against the constants listed above.

- TASK-002 details (file: `packages/backend/src/expenseCategories/handler/createExpenseCategoryHandler.ts`):
- Function signature: `export async function createExpenseCategoryHandler(ctx: Koa.Context): Promise<void>`
- Behavior:
  1. Validate input by calling the exported validation function `createExpenseCategoryValidation(ctx.request.body)` imported from `../validation/createExpenseCategoryValidation` inside a try/catch. The handler MUST NOT call `CreateExpenseCategorySchema.parse` directly; it should rely on the validation function to return the validated object or throw a `ValidationError`.
  2. On success, call `createExpenseCategoryService(validated)` and set `ctx.status = 201` and `ctx.body = { expenseCategory: result }`.
  3. On error, determine status `const status = errorStatusMapper(error)` and set `ctx.status = status` and `ctx.body = { error: error instanceof Error ? error.message : String(error) }`.
- Imports:
  - `createExpenseCategoryValidation` from `../validation/createExpenseCategoryValidation` (relative path)
  - `createExpenseCategoryService` from `../service/createExpenseCategoryService`
  - `errorStatusMapper` from `../../utilities/errorStatusMapper`
  - `ValidationError` from models if needed for custom logic (but use errorStatusMapper to determine status)
- Tests (unit test structure to add in `packages/backend/src/expenseCategories/__tests__/handler/createExpenseCategoryHandler.test.ts`):
  - Happy path:
    - Mock `createExpenseCategoryService` to return a mapped expenseCategory object.
    - Invoke handler with a valid `ctx.request.body` and assert `ctx.status === 201` and `ctx.body.expenseCategory` equals the mocked object.
  - Failure path(s):
- Simulate validation error or service error (mock `createExpenseCategoryValidation` to throw a `ValidationError`, or mock service to throw).
  - Invoke handler and assert `ctx.status !== 201` (i.e., any non-201 status is acceptable) and `ctx.body.error` is a non-empty string.
  - Do NOT assert a specific status code; handler delegates status mapping to `errorStatusMapper` which is tested elsewhere.
  - Implementation note: Tests should follow existing handler test patterns and only assert that failures produce a non-201 status and an `error` message in `ctx.body`.
- Completion criteria: Handler file compiles and unit tests cover the happy path (201 + body) and failure paths (non-201 status + error message present).

- TASK-003 details (file: `packages/backend/src/expenseCategories/handler/index.ts`):
- Add named export: `export { createExpenseCategoryHandler } from './createExpenseCategoryHandler'`
- Completion criteria: `handler` barrel exports new handler and existing imports in `server.ts` can destructure it.

- TASK-004 details (file: `packages/backend/src/server.ts`):
  - Add import in existing import block: include `createExpenseCategoryHandler` from `./expenseCategories/handler`.
  - Add router registration: `router.post('/createexpensecategory', createExpenseCategoryHandler)` directly after the existing `createexpense` route registration.
  - Completion criteria: Server compiles and route is registered.

### Checkpoint 1

Checkpoint conditions: After Phase 1 tasks complete, ensure TypeScript compile passes and unit tests for validation and handler (created in Phase 1) pass locally.

### Implementation Phase 2

- GOAL-002: Implement service, repository, mapper, and repository wiring.

| Task     | Description                                                                                                                       | Completed | Date |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-005 | Create `createExpenseCategoryService.ts` that performs business logic and calls repository.                                       |           |      |
| TASK-006 | Create `createExpenseCategoryRepository.ts` which inserts using Drizzle and returns the inserted row.                             |           |      |
| TASK-007 | Create mapper `mapExpenseCategoryFromDb.ts` in `packages/backend/src/utilities/mappers/` to convert Drizzle row to domain object. |           |      |
| TASK-008 | Update `packages/backend/src/expenseCategories/repository/index.ts` and `service/index.ts` barrel files to export new functions.  |           |      |

Detailed tasks:

- TASK-005 details (file: `packages/backend/src/expenseCategories/service/createExpenseCategoryService.ts`):
- Exported function:
  - `export async function createExpenseCategoryService(input: CreateExpenseCategoryInput): Promise<ExpenseCategory>`
- `ExpenseCategory` is a domain type; define or import from `packages/backend/src/expenseCategories/models.ts` if present. If not present, create an explicit named export `ExpenseCategory` type in `models.ts` with fields:
- userId: string
- accountId: string
  - name: string
  - subcategories: string[]
  - createdAt: string (ISO) | Date (follow existing mapper conventions)
  - updatedAt: string (ISO) | Date
- Behavior:
  1. Validate any additional business rules (none specified).
  2. Create repository input object matching DB columns: `{ userId: input.userId, accountId: input.accountId, name: input.name, subcategories: input.subcategories }`.
  3. Call repository `createExpenseCategoryRepository(repositoryInput)`.
  4. Pass repository result into `mapExpenseCategoryFromDb` and return the mapped domain object.
- Completion criteria: Service returns mapped object for a successful repository insertion; errors are thrown upward.

- TASK-006 details (file: `packages/backend/src/expenseCategories/repository/createExpenseCategoryRepository.ts`):
- Exported function:
- `export async function createExpenseCategoryRepository(input: { userId: string; accountId: string; name: string; subcategories: string[] }): Promise<ExpensesCategoryDbRow>`
- Implementation:

1. Import `db` client and `expenseCategoriesTable` from `packages/backend/src/db/schema.ts`.
2. Use Drizzle insert pattern: `const [inserted] = await db.insert(expenseCategoriesTable).values(input).returning();` (If Drizzle API returns different shape, ensure `returning()` is used. If `.returning()` not available, use a select after insert.)
3. Return `inserted`.

- Completion criteria: Repository compiles and unit tests using a mocked `db` verify that `db.insert` is called with the exact object and that the returned value is forwarded.

- TASK-007 details (file: `packages/backend/src/utilities/mappers/mapExpenseCategoryFromDb.ts`):
- Exported function: `export function mapExpenseCategoryFromDb(row: ExpensesCategoryDbRow): ExpenseCategory`
- Mapping rules:
  - `userId` and `accountId` remain numbers.
  - `name` string.
  - `subcategories` map from DB array to string[] (if DB returns `subcategories` as a JSON/string array, ensure the mapper normalizes to string[]).
  - `createdAt` and `updatedAt` map to ISO strings or Date objects depending on domain conventions; follow existing mappers in `packages/backend/src/utilities/mappers/` for consistency. If existing mappers use `createdAt: row.createdAt.toISOString()`, follow that.
- Completion criteria: Mapper has explicit type annotations and a unit test verifying expected mapping.

- TASK-008 details (files: `packages/backend/src/expenseCategories/repository/index.ts`, `packages/backend/src/expenseCategories/service/index.ts`):
- Add named exports for the new functions.
- Completion criteria: Barrel exports updated and import paths in service/handler resolve.

### Checkpoint 2

Checkpoint conditions: After Phase 2, run TypeScript compile, run repository & service unit tests; ensure passing tests for insertion flow with mocked db and mapper.

## 3. Alternatives

- **ALT-001**: Use UUIDs for `userId`/`accountId` instead of integers. Not chosen because `schema.ts` defines integer types.
- **ALT-002**: Store `subcategories` as JSONB instead of varchar[]; not chosen as schema currently uses `varchar().array()`.

## 4. Dependencies

- **DEP-001**: Drizzle ORM (already present in repo).
- **DEP-002**: Zod (alreay present in repo)
- **DEP-003**: Jest (for tests), and any existing test setup in `packages/backend/jest.config.js`.

## 5. Files

- **FILE-001**: `packages/backend/src/expense/validation/createExpenseCategoryValidation.ts` — Zod schema + types
- **FILE-002**: `packages/backend/src/expense/handler/createExpenseCategoryHandler.ts` — Koa handler
- **FILE-003**: `packages/backend/src/expense/handler/index.ts` — update export
- **FILE-004**: `packages/backend/src/server.ts` — register route `/createexpensecategory`
- **FILE-005**: `packages/backend/src/expense/service/createExpenseCategoryService.ts` — service business logic
- **FILE-006**: `packages/backend/src/expense/service/index.ts` — update barrel export
- **FILE-007**: `packages/backend/src/expense/repository/createExpenseCategoryRepository.ts` — Drizzle insert
- **FILE-008**: `packages/backend/src/expense/repository/index.ts` — update barrel export
- **FILE-009**: `packages/backend/src/utilities/mappers/mapExpenseCategoryFromDb.ts` — mapper utility
- **FILE-010**: `packages/backend/src/expense/__tests__/handler/createExpenseCategoryHandler.test.ts` — handler tests
- **FILE-011**: `packages/backend/src/expense/__tests__/service/createExpenseCategoryService.test.ts` — service tests
- **FILE-012**: `packages/backend/src/expense/__tests__/repository/createExpenseCategoryRepository.test.ts` — repository tests
- **FILE-013**: `packages/backend/src/expense/__tests__/validation/createExpenseCategoryValidation.test.ts` — validation tests

## 6. Testing

- **TEST-001**: Validation tests (file: FILE-013):
  - When valid input provided, `CreateExpenseCategorySchema.parse` should return typed object (assert values and defaulting of `subcategories` to []).
  - When invalid input provided (missing `name` or wrong types), should throw `ValidationError` (or Zod error wrapped by project's validation error handling). Use existing test pattern in `packages/backend/src/expense/validation/__tests__` as template.

- **TEST-002**: Repository tests (file: FILE-012):
  - Mock `db.insert` and verify it is called with exact object.
  - Simulate `db.insert(...).returning()` returning a row and assert repository returns that row.

- **TEST-003**: Service tests (file: FILE-011):
  - Mock repository to return a DB row; verify service calls mapper and returns domain object.
  - Edge: repository throws `RepositoryError` and service rethrows.

- **TEST-004**: Handler tests (file: FILE-010):
  - Happy path: mock `createExpenseCategoryService` to return a mapped object; assert handler sets `ctx.status` 201 and `ctx.body.expenseCategory` exists.
  - Invalid input: cause validation parse to throw; assert handler uses `errorStatusMapper` to set 422 and includes error message in `ctx.body.error`.

Test run criteria: All new tests listed pass locally in `packages/backend` test runner.

## 7. Risks & Assumptions

- **RISK-001**: Schema mismatch: `expense_categories` table in `schema.ts` doesn't include a primary `id`. This plan assumes the domain object will mirror columns and not rely on a generated `id`.
- **ASSUMPTION-002**: Drizzle's `insert(...).values(...).returning()` pattern is available. If not, repository will use an insert followed by a select.

## 8. Related Specifications / Further Reading

- `packages/backend/src/db/schema.ts` (expenseCategories table definition)
- `packages/backend/src/utilities/errorStatusMapper.ts`
- Example handlers and tests in `packages/backend/src/expense/*` to mirror patterns

---

Validation checklist (explicit):

- [ ] REQ-001: Server route added and handler wired
- [ ] REQ-002/REQ-003: Zod validation added and tested
- [ ] REQ-004: Service implemented and typed
- [ ] REQ-005: Repository inserts to DB using Drizzle
- [ ] REQ-006: Mapper implemented and used
- [ ] REQ-007: Error mapping via `errorStatusMapper` implemented in handler
- [ ] GUD-001: Tests added for validation, repository, service, handler

Quality gates (actions to run after implementation):

- TypeScript compile: run from `packages/backend` (e.g., `npm run build` or `tsc --noEmit`).
- Lint: run existing linting for backend package.
- Unit tests: `npm test` within `packages/backend` or run Jest on created test files.
- Smoke test: start backend (`npm run dev`) and POST an example payload to `/createexpensecategory` and verify 201 response and returned object.

Validation criteria (automatable):

- Each TASK-00X marked Completed only when:
  - File exists at the specified path.
  - File exports the named symbol(s) exactly as specified.
  - Corresponding unit tests for that file pass.

End of plan.
