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

This document is a deterministic, machine- and human-actionable implementation plan to add a POST endpoint named `deleteexpensesubcategory` in the existing `expenseSubCategories` domain. The endpoint receives three required UUIDs (userId, accountId, subCategoryId), validates them, and performs a soft-delete of the expense subcategory record in the database. The plan lists exact file paths, function names, test files, and measurable completion criteria so an AI agent or engineer can implement it without further interpretation.

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
- [x] Phase 1: Add validation and models for the input payload
- [ ] Phase 2: Implement repository and mappers to perform soft-delete
- [ ] Phase 3: Implement service and handler wiring and register route
- [ ] Phase 4: Tests and e2e

### Implementation Phase 1

- GOAL-001: Add validation and models for the input payload.

| Task     | Description                                                                                                                                                                                                                         | Completed | Date |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-001 | Create input schema `DeleteExpenseSubCategoryInputSchema` (zod) and TypeScript type `DeleteExpenseSubCategoryInput` in `packages/backend/src/expenseSubCategories/validation/models.ts`                                             | ✅        | 2025-09-14 |
| TASK-002 | Implement `validateDeleteExpenseSubCategory` in `packages/backend/src/expenseSubCategories/validation/deleteExpenseSubCategoryValidation.ts` which parses with zod and throws/wraps errors using project's `validationError` helper | ✅        | 2025-09-14 |

Measurable completion criteria (Phase 1): both files exist, `DeleteExpenseSubcategoryInputSchema.parse` used, and `validateDeleteExpenseSubcategory` exports named function and is imported by handler in Phase 2.

Files touched/created (phase 1):

- `packages/backend/src/expenseSubCategories/validation/models.ts` (add schema/type)
- `packages/backend/src/expenseSubCategories/validation/deleteExpenseSubcategoryValidation.ts`

### Implementation Phase 2

- GOAL-002: Implement repository and mappers to perform soft-delete.

| Task     | Description                                                                                                                                                                                                                                                                                    | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- | --- |
| TASK-003 | Add repository function `deleteExpenseSubcategoryRepository` in `packages/backend/src/expenseSubCategories/repository/deleteExpenseSubcategoryRepository.ts`. It performs a soft-delete using Drizzle or project DB layer and returns `{ success: boolean }` or throws an error on DB failure. |           |      |
| TASK-004 | Add/update a mapper (if needed) in `packages/backend/src/utilities/mappers/expenseSubCategoryMapper.ts` to map DB rows to domain types. If repository only updates a timestamp and returns success boolean, return a normalized object: `{ id: string, deletedAt: string                       | null }`.  |      |     |

Measurable completion criteria (Phase 2): repository function compiles (tsc), uses DB layer, returns a deterministic shape, and unit tests cover DB error and success cases.

Files touched/created (phase 2):

- `packages/backend/src/expenseSubCategories/repository/deleteExpenseSubcategoryRepository.ts`
- `packages/backend/src/utilities/mappers/expenseSubCategoryMapper.ts` (create or extend)

Implementation detail (deterministic):

- Function name: `deleteExpenseSubcategoryRepository`
- Signature: `export async function deleteExpenseSubcategoryRepository(input: DeleteExpenseSubcategoryInput): Promise<{ id: string; deletedAt: string | null }>`
- Behavior: Use Drizzle or existing `db` client to update `expense_subcategories` table where id = input.subCategoryId AND account_id = input.accountId AND user_id = input.userId. Set `deleted_at` = new Date(). If no rows matched (rowCount === 0), return `{ id: input.subCategoryId, deletedAt: null }` to indicate "already gone". On DB error, rethrow or throw a repository-specific error for the service to handle.

ASSUMPTION-001: A table named `expense_subcategories` exists with columns `id`, `account_id`, `user_id`, and `deleted_at`. If the actual schema differs, replace column names accordingly.

### Implementation Phase 3

- GOAL-003: Implement service and handler wiring and register route

| Task     | Description                                                                                                                                                                                                                                                                                                                           | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-005 | Implement `deleteExpenseSubcategoryService` in `packages/backend/src/expenseSubCategories/service/deleteExpenseSubcategoryService.ts`. It calls the repository and translates repository results into domain-level success/failure responses.                                                                                         |           |      |
| TASK-006 | Implement HTTP handler `deleteExpenseSubcategoryHandler` in `packages/backend/src/expenseSubCategories/handler/deleteExpenseSubcategoryHandler.ts`. It should: validate input, call service, catch errors, map status using `utilities/errorStatusMapper.ts`, and return JSON with either `{ id, deletedAt }` or `{ error: string }`. |           |      |
| TASK-007 | Export handler from `packages/backend/src/expenseSubCategories/handler/index.ts` and import/register route in `packages/backend/src/server.ts` using POST method and path `/expense-subcategories/delete` (or match existing route naming convention)                                                                                 |           |      |

Measurable completion criteria (Phase 3): handler compiles and is reachable via the server (manual or automated smoke test). The route is registered and the handler returns expected JSON shapes.

Exact function names and exports:

- `deleteExpenseSubcategoryService(input: DeleteExpenseSubcategoryInput): Promise<{ id: string; deletedAt: string | null }>`
- `deleteExpenseSubcategoryHandler(req, res): Promise<void>` exported as named `deleteExpenseSubcategoryHandler`

Behavior detail for handler:

1. Call `validateDeleteExpenseSubcategory(req.body)`; if it throws, catch and respond with `{ error }` and status from `errorStatusMapper`.
2. Call `deleteExpenseSubcategoryService(validatedInput)`.
3. On success return 200 with `{ id: string, deletedAt: string | null }`.
4. If service throws a known error, map status and return `{ error: string }`.

### Implementation Phase 4

- GOAL-004: Tests and e2e

| Task     | Description                                                                                                                                                                                  | Completed | Date |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-008 | Unit tests for validation: `packages/backend/src/expenseSubCategories/__tests__/validation/deleteExpenseSubcategoryValidation.test.ts` (cover missing fields, invalid UUIDs)                 |           |      |
| TASK-009 | Unit tests for repository: `packages/backend/src/expenseSubCategories/__tests__/repository/deleteExpenseSubcategoryRepository.test.ts` (mock DB, error and success)                          |           |      |
| TASK-010 | Unit tests for service: `packages/backend/src/expenseSubCategories/__tests__/service/deleteExpenseSubcategoryService.test.ts` (mock repository errors and success)                           |           |      |
| TASK-011 | Unit tests for handler: `packages/backend/src/expenseSubCategories/__tests__/handler/deleteExpenseSubcategoryHandler.test.ts` (mock validation and service; do not mock `errorStatusMapper`) |           |      |
| TASK-012 | Add Playwright e2e: `packages/backend/e2e/deleteExpenseSubcategory.spec.ts` mirroring style of other e2e tests.                                                                              |           |      |

Measurable completion criteria (Phase 4): Jest tests pass locally (run `npm run test:unit` in `packages/backend`), and e2e passes in CI or local dev environment.

Test names and structure (deterministic):

- Validation tests use `describe('when validation occurs for deleteExpenseSubcategory')` and `it('should return non success when subCategoryId is invalid')` style.
- Handler tests: `describe('when deleteExpenseSubcategory handler is invoked')` with `it` blocks for validation failure, service failure, and success.

## 3. Alternatives

- **ALT-001**: Implement as HTTP DELETE on `/expense-subcategories/:id` (rejected per request which requires POST). Rationale: RESTful, but the user explicitly requested a POST.
- **ALT-002**: Hard delete (DELETE row) instead of soft-delete. Rejected: data recovery and auditability requirement; soft-delete is safer.

## 4. Dependencies

- **DEP-001**: Drizzle or current DB client in `packages/backend/src/db` (existing project dependency)
- **DEP-002**: `zod` for validation (already used elsewhere in project)
- **DEP-003**: `utilities/errorStatusMapper.ts` and `validationError` helper from the project

## 5. Files

- **FILE-001**: `packages/backend/src/expenseSubCategories/validation/models.ts` — add `DeleteExpenseSubcategoryInputSchema` and TypeScript type
- **FILE-002**: `packages/backend/src/expenseSubCategories/validation/deleteExpenseSubcategoryValidation.ts` — validate and export `validateDeleteExpenseSubcategory`
- **FILE-003**: `packages/backend/src/expenseSubCategories/repository/deleteExpenseSubcategoryRepository.ts` — implement DB soft-delete logic
- **FILE-004**: `packages/backend/src/utilities/mappers/expenseSubCategoryMapper.ts` — map DB row to domain object
- **FILE-005**: `packages/backend/src/expenseSubCategories/service/deleteExpenseSubcategoryService.ts` — service that calls repository
- **FILE-006**: `packages/backend/src/expenseSubCategories/handler/deleteExpenseSubcategoryHandler.ts` — handler implementing validation/service call and error mapping
- **FILE-007**: `packages/backend/src/expenseSubCategories/handler/index.ts` — export handler (update)
- **FILE-008**: `packages/backend/src/server.ts` — register POST `/expense-subcategories/delete` route (update)
- **FILE-009**: Unit test files under `packages/backend/src/expenseSubCategories/__tests__/...` (validation, repository, service, handler)
- **FILE-010**: `packages/backend/e2e/deleteExpenseSubcategory.spec.ts` — e2e test

## 6. Testing

- **TEST-001**: Validation unit tests (happy path + each missing/invalid field) — expect zod `ZodError` wrapped via `validationError`
- **TEST-002**: Repository tests: DB success returns `{ id, deletedAt }`, DB error throws and service surfaces error
- **TEST-003**: Service tests: when repository throws, service rejects with structured error; when repository succeeds, service returns normalized object
- **TEST-004**: Handler tests: when validation throws -> non-success response with `error`; when service throws -> non-success response; when success -> 200 JSON with `{ id, deletedAt }`
- **TEST-005**: e2e: simulate create subcategory, then call POST `/expense-subcategories/delete` with required body and assert subcategory is marked deleted (or subsequent GET doesn't return it)

## 7. Risks & Assumptions

- **RISK-001**: Database schema mismatch (table or column names differ). Mitigation: check `packages/backend/src/db/schema.ts` before implementation; keep ASSUMPTION-001 documented and update implementation accordingly.
- **RISK-002**: Unclear authentication expectations. Mitigation: rely on `userId` in body and existing middleware; add explicit guard if required.
- **ASSUMPTION-001**: There is a table `expense_subcategories` with columns `id`, `user_id`, `account_id`, and `deleted_at`.
- **ASSUMPTION-002**: Project uses Drizzle or a DB client with similar API for updates/inserts and already-exported `db` instance is available at `packages/backend/src/db/index.ts` or similar.

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
