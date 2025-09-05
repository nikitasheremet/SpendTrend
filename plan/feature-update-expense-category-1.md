---
goal: Create Update Expense Category endpoint (updateExpenseCategory)
version: 1.0
date_created: 2025-09-03
last_updated: 2025-09-03
owner: backend-team
status: 'Planned'
tags: ['feature', 'expense-category', 'backend']
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This document is a deterministic, machine-parseable implementation plan to add a new backend API endpoint named updateExpenseCategory. It prescribes the exact files, function names, data shapes, validations, and tests required. Each phase contains atomic tasks with measurable completion criteria so human developers or automated agents can execute without additional interpretation.

## 1. Requirements & Constraints

- **REQ-001**: Add a PUT endpoint `/updateexpensecategory` registered in `packages/backend/src/server.ts` that is handled by `updateExpenseCategoryHandler`.
- **REQ-002**: Handler must call validation function `validateUpdateExpenseCategoryInput` and then call service function `updateExpenseCategoryService`.
- **REQ-003**: Validation schema fields: `id` (uuid, required), `userId` (uuid, required), `accountId` (uuid, required), `name` (string, optional), `subcategories` (array of strings, optional). At least one of `name` or `subcategories` must be provided.
- **REQ-004**: Service accepts an input type identical to the Zod parse result and returns the updated domain `ExpenseCategory` object.
- **REQ-005**: Repository function `updateExpenseCategoryRepository` must accept an object with `id` and `updates` (containing the fields to update), query the `expense_categories` table using Drizzle ORM to update the row where `id` matches, and return the updated row. If no row is updated, throw a `RepositoryError`.
- **REQ-006**: Use the existing mapper `dbExpenseCategoryToDomain` to convert the Drizzle row into a domain `ExpenseCategory` object before returning from the service.
- **REQ-007**: On failures, handler must set HTTP status using `errorStatusMapper` and set `ctx.body` to an object with an `error` property containing a human-readable message.
- **REQ-008**: Follow the existing `expenseCategories` domain structure under `packages/backend/src/expenseCategories`.
- **SEC-001**: No network calls outside the local project during implementation; tests should use mocks where appropriate.
- **CON-001**: Use TypeScript and existing project conventions (no default exports, named exports only).
- **GUD-001**: Add Jest unit tests for validation, service, repository, and handler.
- **PAT-001**: Identifier prefixes: all new task identifiers and references use the prefixes defined in this plan (e.g., REQ-, TASK-, FILE-).

Assumptions (explicit):

- **ASSUMPTION-001**: `expense_categories` schema in `packages/backend/src/db/schema.ts` includes columns `id`, `userId`, `accountId`, `name`, `subcategories`, `createdAt`, `updatedAt`.
- **ASSUMPTION-002**: A generic `db` export and Drizzle client exist in `packages/backend/src/db/index.ts` and can be imported by repository code.
- **ASSUMPTION-003**: The mapper `dbExpenseCategoryToDomain` exists at `packages/backend/src/utilities/mappers/expenseCategory/dBExpenseCategoryToDomain.ts`.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Add validation and handler wiring.

| Task     | Description                                                                                                                                                                                                                                                                                                           | Completed | Date |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-101 | Update `models.ts` to export `UpdateExpenseCategoryInputSchema` (Zod) and `UpdateExpenseCategoryInput` type under `packages/backend/src/expenseCategories/validation`, and create `updateExpenseCategoryValidation.ts` which exports `validateUpdateExpenseCategoryInput` that parses and rethrows validation errors. |           |      |
| TASK-102 | Create `updateExpenseCategoryHandler.ts` that imports the schema, validates input, calls `updateExpenseCategoryService`, and handles success/error using `errorStatusMapper` under `packages/backend/src/expenseCategories/handler`.                                                                                  |           |      |
| TASK-103 | Update `packages/backend/src/expenseCategories/handler/index.ts` to export the new handler.                                                                                                                                                                                                                           |           |      |
| TASK-104 | Update `packages/backend/src/server.ts` to register the PUT route `/updateexpensecategory` to `updateExpenseCategoryHandler`.                                                                                                                                                                                         |           |      |

Detailed tasks (atomic):

- TASK-101 details:
  - Files to create/update: `packages/backend/src/expenseCategories/validation/models.ts` and `packages/backend/src/expenseCategories/validation/updateExpenseCategoryValidation.ts`
  - Schema: `z.object({ id: idSchema, userId: userIdSchema, accountId: accountIdSchema, name: nameSchema.optional(), subcategories: subcategoriesSchema.optional() }).refine((data) => !(data.name === undefined && data.subcategories === undefined), { message: "At least one of 'name' or 'subcategories' must be provided" })`
  - Completion criteria: `models.ts` and `updateExpenseCategoryValidation.ts` exist; validation function parses valid input and rethrows `ValidationError` on invalid input.

- TASK-102 details (file: `packages/backend/src/expenseCategories/handler/updateExpenseCategoryHandler.ts`):
  - Function signature: `export async function updateExpenseCategoryHandler(ctx: Koa.Context): Promise<void>`
  - Completion criteria: Handler file compiles and unit tests cover the happy path (200 + body) and failure paths (non-200 status + error message present).

- TASK-103 details (file: `packages/backend/src/expenseCategories/handler/index.ts`):
  - Add named export: `export { updateExpenseCategoryHandler } from './updateExpenseCategoryHandler'`
  - Completion criteria: `handler` barrel exports new handler and existing imports in `server.ts` can destructure it.

- TASK-104 details (file: `packages/backend/src/server.ts`):
  - Add import in existing import block: include `updateExpenseCategoryHandler` from `./expenseCategories/handler`.
  - Completion criteria: Server compiles and route is registered.

### Checkpoint 1

Checkpoint conditions: After Phase 1 tasks complete, ensure TypeScript compile passes and unit tests for validation and handler (created in Phase 1) pass locally.

### Implementation Phase 2

- GOAL-002: Implement service, repository wiring, and map results.

| Task     | Description                                                                                                                                                                                                                                                                    | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-201 | Create `updateExpenseCategoryService.ts` that transforms input to repository input with id and updates object, and calls `updateExpenseCategoryRepository` under `packages/backend/src/expenseCategories/service`.                                                             |           |      |
| TASK-202 | Create `updateExpenseCategoryRepository.ts` that accepts an object with id and updatable fields, uses Drizzle to update the expense category by spreading the fields into set, and returns the mapped domain object under `packages/backend/src/expenseCategories/repository`. |           |      |
| TASK-203 | Update `packages/backend/src/expenseCategories/service/index.ts` and `packages/backend/src/expenseCategories/repository/index.ts` to export the new functions.                                                                                                                 |           |      |

Detailed tasks (atomic):

- TASK-201 details (file: `packages/backend/src/expenseCategories/service/updateExpenseCategoryService.ts`):
  - Function signature: `export async function updateExpenseCategoryService(input: UpdateExpenseCategoryInput): Promise<ExpenseCategory>`
  - Transform input to repository input: `{ id: input.id, updates: { name: input.name, subcategories: input.subcategories } }`
  - Completion criteria: Service calls repository with correct input and returns the result.

- TASK-202 details (file: `packages/backend/src/expenseCategories/repository/updateExpenseCategoryRepository.ts`):
  - Input type: `{ id: string, updates: { name?: string, subcategories?: string[] } }`
  - Use `db.update(expenseCategoriesTable).set(input.updates).where(eq(expenseCategoriesTable.id, input.id)).returning()`
  - If returning array is empty, throw `RepositoryError` with `NOT_FOUND_ERROR`.
  - Otherwise, in catch block, throw `RepositoryError` with `${DB_ERROR}: ${(error as Error).message}`.
  - Completion criteria: Repository updates the row and returns the mapped domain object.

- TASK-203 details:
  - Files: `packages/backend/src/expenseCategories/service/index.ts` and `packages/backend/src/expenseCategories/repository/index.ts`
  - Add exports for the new functions.
  - Completion criteria: Barrel files export the new functions.

### Checkpoint 2

Checkpoint conditions: After Phase 2 tasks complete, ensure TypeScript compile passes and unit tests for service and repository pass locally.

### Implementation Phase 3

- GOAL-003: Add E2E tests for the update endpoint.

| Task     | Description                                                                                                                                                                                                     | Completed | Date |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-301 | Create `updateExpenseCategory.spec.ts` in `packages/backend/e2e/` with Playwright tests covering invalid input, successful update, update non-existing category, and validation of at least one optional field. |           |      |

Detailed tasks (atomic):

- TASK-301 details (file: `packages/backend/e2e/updateExpenseCategory.spec.ts`):
  - Tests:
    - Invalid input: empty object, missing required fields, no optional fields provided.
    - Successful update: create category, update name or subcategories, verify in DB.
    - Update non-existing: try to update with wrong id, expect error.
  - Completion criteria: All tests pass when run with Playwright.

## 3. Alternatives

- **ALT-001**: Use PATCH instead of PUT for partial updates, but PUT is chosen for full update semantics.
- **ALT-002**: Include all fields in update, but optional fields with at least one required is more flexible.

## 4. Dependencies

- **DEP-001**: Drizzle ORM for database operations.
- **DEP-002**: Zod for validation.
- **DEP-003**: Koa for HTTP handling.

## 5. Files

- **FILE-001**: `packages/backend/src/expenseCategories/validation/models.ts`
- **FILE-002**: `packages/backend/src/expenseCategories/validation/updateExpenseCategoryValidation.ts`
- **FILE-003**: `packages/backend/src/expenseCategories/handler/updateExpenseCategoryHandler.ts`
- **FILE-004**: `packages/backend/src/expenseCategories/handler/index.ts`
- **FILE-005**: `packages/backend/src/server.ts`
- **FILE-006**: `packages/backend/src/expenseCategories/service/updateExpenseCategoryService.ts`
- **FILE-007**: `packages/backend/src/expenseCategories/repository/updateExpenseCategoryRepository.ts`
- **FILE-008**: `packages/backend/src/expenseCategories/service/index.ts`
- **FILE-009**: `packages/backend/src/expenseCategories/repository/index.ts`
- **FILE-010**: `packages/backend/e2e/updateExpenseCategory.spec.ts`

## 6. Testing

- **TEST-001**: Unit tests for `validateUpdateExpenseCategoryInput`.
- **TEST-002**: Unit tests for `updateExpenseCategoryHandler`.
- **TEST-003**: Unit tests for `updateExpenseCategoryService`.
- **TEST-004**: Unit tests for `updateExpenseCategoryRepository`.
- **TEST-005**: E2E tests in `updateExpenseCategory.spec.ts`.

## 7. Risks & Assumptions

- **RISK-001**: Database schema changes could affect the update query.
- **ASSUMPTION-001**: The database allows updates on the expense_categories table.

## 8. Related Specifications / Further Reading

- Reference `feature-get-expense-categories-1.md` for similar structure.
- Reference `createExpenseCategory*` files for code patterns.
