---
goal: Delete Expense Subcategory endpoint for expenseSubCategories domain
version: 1.0
date_created: 2025-09-14
last_updated: 2025-09-14
owner: backend-team
status: 'In Progress'
tags: [feature, endpoint, expenseSubCategories]
---

# Introduction

![Status: In Progress](https://img.shields.io/badge/status-In%20Progress-yellow)

This document is a deterministic, machine- and human-actionable implementation plan to add a POST endpoint named `deleteexpensesubcategory` in the existing `expenseSubCategories` domain. The endpoint receives three required UUIDs (userId, accountId, subCategoryId), validates them, and performs a hard-delete of the expense subcategory record in the database. The plan lists exact file paths, function names, test files, and measurable completion criteria so an AI agent or engineer can implement it without further interpretation.

## 1. Requirements & Constraints

- **REQ-001**: Endpoint name: `deleteexpensesubcategory` (HTTP method: POST)
- **REQ-002**: Domain: `expenseSubCategories`
- **REQ-003**: Input fields (all required):
  - `userId` - uuid - required
  - `accountId` - uuid - required
  - `subCategoryId` - uuid - required
- **REQ-004**: Use zod for validation and wrap validation failures with the repository's `validationError` pattern
- **REQ-005**: Follow project conventions: TypeScript, named exports, camelCase identifiers
- **REQ-006**: Handler must call validation -> service -> repository, and use `errorStatusMapper.ts` to set HTTP statuses
- **REQ-007**: Register the handler route in `packages/backend/src/server.ts` following existing route conventions
- **REQ-008**: Write unit tests (Jest) for validation, handler, service, repository success and failure cases
- **REQ-009**: Add an e2e Playwright spec under `packages/backend/e2e/` mirroring existing tests
- **PAT-001**: Follow existing domain file layout (handler, validation, service, repository, tests)

## 2. Implementation Steps

### Phase Completion Checklist

- [x] Phase 1: Add validation and models for the input payload and validation unit tests
- [x] Phase 2: Implement repository to perform hard-delete with unit tests
- [ ] Phase 3: Implement service and handler wiring and register route with unit tests
- [ ] Phase 4: Implement e2e tests

### Implementation Phase 1

- GOAL-001: Add validation and models for the input payload and write unit tests.

| Task     | Description                                                                                                                                                                                                                         | Completed | Date       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Create input schema `DeleteExpenseSubCategoryInputSchema` (zod) and TypeScript type `DeleteExpenseSubCategoryInput` in `packages/backend/src/expenseSubCategories/validation/models.ts`                                             | ✅        | 2025-09-14 |
| TASK-002 | Implement `validateDeleteExpenseSubCategory` in `packages/backend/src/expenseSubCategories/validation/deleteExpenseSubCategoryValidation.ts` which parses with zod and throws/wraps errors using project's `validationError` helper | ✅        | 2025-09-14 |
| TASK-003 | Write unit tests for validation in `packages/backend/src/expenseSubCategories/__tests__/validation/deleteExpenseSubCategoryValidation.test.ts` (cover missing fields, invalid UUIDs)                                                | ✅        | 2025-09-14 |

Measurable completion criteria (Phase 1): both files exist, `DeleteExpenseSubcategoryInputSchema.parse` used, and `validateDeleteExpenseSubcategory` exports named function and is imported by handler in Phase 2.

Files touched/created (phase 1):

- `packages/backend/src/expenseSubCategories/validation/models.ts` (add schema/type)
- `packages/backend/src/expenseSubCategories/validation/deleteExpenseSubcategoryValidation.ts`

### Implementation Phase 2

- GOAL-002: Implement repository to perform hard-delete and write unit tests.

| Task      | Description                                                                                                                                                                                                                                                                                                                                                                    | Completed | Date       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---------- |
| TASK-004  | Add repository function `deleteExpenseSubCategoryRepository` in `packages/backend/src/expenseSubCategories/repository/deleteExpenseSubCategoryRepository.ts`. It performs a hard-delete using Drizzle or project DB layer and returns `{ success: boolean }` on success or throws an error on DB failure.                                                                      | ✅        | 2025-09-15 |
| TASK-005A | Add repository function `deleteExpenseSubCategoryReferencesInExpensesRepository` to `packages/backend/src/expenseSubCategories/repository/deleteExpenseSubCategoryRepository.ts`. This function should delete all occurrences of the provided `subCategoryId` from the `expenses` table and return the number of rows affected; on DB error throw a repository-specific error. | ✅        | 2025-09-15 |
| TASK-005  | Write unit tests for repository in `packages/backend/src/expenseSubCategories/__tests__/repository/deleteExpenseSubCategoryRepository.test.ts` (mock DB, error and success cases). Include tests for the new function that removes `subCategoryId` references from the `expenses` table (success: rows removed; DB error).                                                     | ✅        | 2025-09-15 |

Measurable completion criteria (Phase 2): repository function compiles (tsc), uses DB layer, returns a deterministic shape, and unit tests cover DB error and success cases.

Files touched/created (phase 2):

- `packages/backend/src/expenseSubCategories/repository/deleteExpenseSubCategoryRepository.ts`

Implementation detail (deterministic):

- Function name: `deleteExpenseSubCategoryRepository`
- Signature: `export async function deleteExpenseSubCategoryRepository(input: DeleteExpenseSubCategoryInput): Promise<ExpenseSubCategoryDbRow>`
- Behavior: Use Drizzle or existing `db` client to find the subcategory row by id/account_id/user_id, DELETE it from the `expense_subcategories` table, and return the deleted row as the DB-typed object (`ExpenseSubCategoryDbRow`). If the row does not exist throw a `NotFound`-style repository error. On DB error, throw a repository-specific error for the service to handle.

Additional repository requirement (same file):

- Add a second exported function in the same file: `deleteExpenseSubCategoryReferencesInExpenses` (name may be shortened to match project conventions). Signature: `export async function deleteExpenseSubCategoryReferencesInExpenses(subCategoryId: string): Promise<number>`
- Behavior: Use the `db` client to update all rows in the `expenses` table that reference the provided `subCategoryId`. Return the number of rows affected (or an appropriate DB-typed result). On DB error, throw a repository-specific error. This function should be called by the service immediately after the subcategory row is successfully deleted to ensure referential cleanup.

ASSUMPTION-001: A table named `expense_subcategories` exists with columns `id`, `account_id`, `user_id`. If the actual schema differs, replace column names accordingly.

### Implementation Phase 3

- GOAL-003: Implement service and handler wiring, register route, and write unit tests.

| Task      | Description                                                                                                                                                                                                                                                                                                                                        | Completed | Date |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-006  | Implement `deleteExpenseSubCategoryService` in `packages/backend/src/expenseSubCategories/service/deleteExpenseSubCategoryService.ts`. It calls the repository and returns the deleted `ExpenseSubCategoryDbRow` to the handler. If the repository reports "NotFound", the service should propagate a NotFound-style error for the handler to map. |           |      |
| TASK-006A | Ensure service calls repository cleanup function `deleteExpenseSubCategoryReferencesInExpenses` after successful deletion and add unit tests to verify cleanup is invoked and errors are propagated.                                                                                                                                               |           |      |
| TASK-007  | Implement HTTP handler `deleteExpenseSubCategoryHandler` in `packages/backend/src/expenseSubCategories/handler/deleteExpenseSubCategoryHandler.ts`. It should: validate input, call service, catch errors, map status using `utilities/errorStatusMapper.ts`, and return JSON with either the deleted subcategory object or `{ error: string }`.   |           |      |
| TASK-008  | Export handler from `packages/backend/src/expenseSubCategories/handler/index.ts` and import/register route in `packages/backend/src/server.ts` using POST method and path `/expense-subcategories/delete` (or match existing route naming convention)                                                                                              |           |      |
| TASK-009  | Write unit tests for service in `packages/backend/src/expenseSubCategories/__tests__/service/deleteExpenseSubCategoryService.test.ts` (mock repository errors and success)                                                                                                                                                                         |           |      |
| TASK-010  | Write unit tests for handler in `packages/backend/src/expenseSubCategories/__tests__/handler/deleteExpenseSubCategoryHandler.test.ts` (mock validation and service; do not mock `errorStatusMapper`)                                                                                                                                               |           |      |

Measurable completion criteria (Phase 3): handler compiles and is reachable via the server (manual or automated smoke test). The route is registered and the handler returns expected JSON shapes.

Exact function names and exports:

- `deleteExpenseSubCategoryService(input: DeleteExpenseSubCategoryInput): Promise<ExpenseSubCategoryDbRow>`
- `deleteExpenseSubCategoryHandler(req, res): Promise<void>` exported as named `deleteExpenseSubCategoryHandler`

Behavior detail for handler:

1. Call `validateDeleteExpenseSubCategory(req.body)`; if it throws, catch and respond with `{ error }` and status from `errorStatusMapper`.
2. Call `deleteExpenseSubCategoryService(validatedInput)`.
   2.a. After the service calls the repository to remove the subcategory, the service MUST call the repository function that removes `subCategoryId` references from the `expenses` table. The service should ensure this cleanup runs only after the primary delete succeeds. If the cleanup repository call fails, surface the error so the handler can map it via `errorStatusMapper`.
3. On success return 200 with the deleted subcategory object (DB-typed) as JSON, e.g. `{ deleted: true, item: <ExpenseSubCategoryDbRow> }`.
4. If the repository/service throws a NotFound-style error, map it to an HTTP 404 using `errorStatusMapper` and return `{ error: string }` with the mapped status. For other known errors, map and return the appropriate status and error body.

### Implementation Phase 4

- GOAL-004: Write end-to-end (e2e) tests to validate the complete feature

| Task     | Description                                                                                                            | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-011 | Add Playwright e2e test in `packages/backend/e2e/deleteExpenseSubCategory.spec.ts` mirroring style of other e2e tests. |           |      |

Measurable completion criteria (Phase 4): e2e test passes in CI or local dev environment, validating that the entire feature works as expected from end to end.

Test names and structure (deterministic):

- e2e test should simulate creating a subcategory, then call POST `/expense-subcategories/delete` with required body and assert subcategory is permanently deleted (subsequent GET doesn't return it)

## 3. Alternatives

- **ALT-001**: Implement as HTTP DELETE on `/expense-subcategories/:id` (rejected per request which requires POST). Rationale: RESTful, but the user explicitly requested a POST.
- **ALT-002**: Soft delete (update row with deleted_at timestamp) instead of hard-delete. Rejected for simplicity, though it would provide data recovery and auditability benefits.

## 4. Dependencies

- **DEP-001**: Drizzle or current DB client in `packages/backend/src/db` (existing project dependency)
- **DEP-002**: `zod` for validation (already used elsewhere in project)
- **DEP-003**: `utilities/errorStatusMapper.ts` and `validationError` helper from the project

## 5. Files

- **FILE-001**: `packages/backend/src/expenseSubCategories/validation/models.ts` — add `DeleteExpenseSubCategoryInputSchema` and TypeScript type
- **FILE-002**: `packages/backend/src/expenseSubCategories/validation/deleteExpenseSubCategoryValidation.ts` — validate and export `validateDeleteExpenseSubCategory`
  -- **FILE-003**: `packages/backend/src/expenseSubCategories/repository/deleteExpenseSubCategoryRepository.ts` — implement DB hard-delete logic that returns the deleted `ExpenseSubCategoryDbRow` and throws a NotFound-style error if the row does not exist
  -- **FILE-004**: `packages/backend/src/expenseSubCategories/service/deleteExpenseSubCategoryService.ts` — service that calls repository and returns the deleted `ExpenseSubCategoryDbRow`; propagates NotFound errors
  -- **FILE-005**: `packages/backend/src/expenseSubCategories/handler/deleteExpenseSubCategoryHandler.ts` — handler implementing validation/service call and error mapping; returns `{ deleted: true, item: ExpenseSubCategoryDbRow }` on success or maps NotFound to 404
- **FILE-006**: `packages/backend/src/expenseSubCategories/handler/index.ts` — export handler (update)
- **FILE-007**: `packages/backend/src/server.ts` — register POST `/expense-subcategories/delete` route (update)
- **FILE-008**: Unit test files under `packages/backend/src/expenseSubCategories/__tests__/...` for validation, repository, service, and handler
- **FILE-009**: `packages/backend/e2e/deleteExpenseSubCategory.spec.ts` — e2e test

## 6. Testing

- **TEST-001**: Validation unit tests (happy path + each missing/invalid field) — expect zod `ZodError` wrapped via `validationError`
  -- **TEST-002**: Repository tests: DB success returns the deleted `ExpenseSubCategoryDbRow`; when the row is missing the repository throws a NotFound-style error; DB error throws and service surfaces error
  -- **TEST-003**: Service tests: when repository throws NotFound, service propagates a NotFound error; when repository succeeds, service returns `ExpenseSubCategoryDbRow`
  -- **TEST-004**: Handler tests: when validation throws -> non-success response with `error`; when service throws NotFound -> 404 with `{ error }`; when other service errors -> mapped status; when success -> 200 JSON with `{ deleted: true, item: ExpenseSubCategoryDbRow }`
- **TEST-005**: e2e: simulate create subcategory, then call POST `/expense-subcategories/delete` with required body and assert subcategory is permanently deleted (subsequent GET doesn't return it)

## 7. Risks & Assumptions

- **RISK-001**: Database schema mismatch (table or column names differ). Mitigation: check `packages/backend/src/db/schema.ts` before implementation; keep ASSUMPTION-001 documented and update implementation accordingly.
- **RISK-002**: Unclear authentication expectations. Mitigation: rely on `userId` in body and existing middleware; add explicit guard if required.
- **ASSUMPTION-001**: There is a table `expense_subcategories` with columns `id`, `user_id`, and `account_id`.
- **ASSUMPTION-002**: Project uses Drizzle or a DB client with similar API for deletes and already-exported `db` instance is available at `packages/backend/src/db/index.ts` or similar.

## 8. Related Specifications / Further Reading

- Existing endpoint examples (create/update/delete style) in `packages/backend/src/expenseSubCategories` and `packages/backend/e2e/*` (see repository for exact files)
- Project validation and error mapping utilities: `packages/backend/src/utilities/errorStatusMapper.ts`, `validationError.ts`

---

Validation checklist for this plan file (machine-verifiable):

- All front matter fields present: yes
- All required template sections present and populated: yes
- All task identifiers use prefixes `REQ-`, `TASK-`, `TEST-`, `DEP-`, `ASSUMPTION-`, `RISK-`: yes
- File paths provided are absolute within the repo working tree and use existing repo structure: yes (relative to repo root)

Completion summary: this plan file is ready to be executed by an AI implementer or an engineer. It enumerates exact file paths, function names, expected types, tests, and measurable completion criteria. If you want, I can now generate the exact TypeScript stubs and tests described here or open a PR with the changes.
