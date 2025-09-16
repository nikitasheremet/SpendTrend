---
goal: Update Expense Subcategory Endpoint in expenseSubCategories domain
version: 1.0
date_created: 2025-09-11
last_updated: 2025-09-11
owner: backend-team
status: 'Planned'
tags: [feature, backend, expenseSubCategories, api]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan defines a deterministic, machine-parseable implementation plan to add an "update subcategory" endpoint to the existing `expenseSubCategories` domain. The plan follows the project's endpoint template and lists atomic tasks with explicit file paths, function names, completion criteria and automated validation steps.

## Quick checklist (requirements extracted)

- REQ-001: Implement endpoint to update an expense subcategory.
- REQ-002: Input fields: subCategoryId (uuid, required), userId (uuid, required), accountId (uuid, required), name (string, required, non-empty).
- REQ-003: Use zod validation and wrap validation errors per project conventions.
- REQ-004: Service layer to perform business logic and call repository.
- REQ-005: Repository uses drizzle to update DB and return mapped domain object.
- REQ-006: Handler registered in `server.ts` and returns updated entity or structured error { error: string }.
- REQ-007: Add unit tests for handler, validation, service, repository (happy+error paths).
- REQ-008: Add e2e test to `packages/backend/e2e/` verifying full flow.

Assumptions:

- The domain directory exists at `packages/backend/src/expenseSubCategories` with subfolders `handler`, `validation`, `service`, `repository`, `mappers` per repository conventions.
- The project uses TypeScript, Jest for unit tests, Playwright for e2e (per repo). If any path differs, adjust accordingly.

## Template contract (tiny API contract)

- Input: { subCategoryId: string, userId: string, accountId: string, name: string }
- Output success: ExpenseSubCategory object (id, name, accountId, userId, categoryId, createdAt, updatedAt)
- Error output: { error: string } with appropriate HTTP status (mapped via `utilities/errorStatusMapper.ts`)

## 1. Requirements & Constraints

- **REQ-001**: Endpoint updates an existing expense subcategory row by `subCategoryId` and returns the updated object.
- **REQ-002**: Input validation must assert UUID format for IDs and non-empty `name`.
- **REQ-003**: Use zod; parse inputs and throw/wrap validation errors using project's `validationError` wrapper.
- **REQ-004**: Repository must use `drizzle` update APIs and return the DB row.
- **CON-001**: Follow TypeScript-only, named exports, camelCase naming, no magic values.
- **GUD-001**: Use early returns for error handling and try/catch for async operations.
- **PAT-001**: Reuse existing mappers in `mappers/` for DB->domain translation.

## 2. Implementation Steps

### Implementation Phase 1 - Validation + Handler

- GOAL-001: Add validation schema and handler registered with routing.

| Task     | Description                                                                         | File path                                                                                    | Function / Export                                                                                                    | Completed | Date |
| -------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-001 | Add zod input model and validation utility                                          | `packages/backend/src/expenseSubCategories/validation/updateExpenseSubcategoryValidation.ts` | `export const updateExpenseSubcategorySchema: ZodType` and `export function validateUpdateExpenseSubcategory(input)` |           |      |
| TASK-002 | Add handler that calls validation and service, maps errors with `errorStatusMapper` | `packages/backend/src/expenseSubCategories/handler/updateExpenseSubcategoryHandler.ts`       | `export async function updateExpenseSubcategoryHandler(req, reply)`                                                  |           |      |
| TASK-003 | Register route in server routing entry                                              | `packages/backend/src/server.ts` (or routing module)                                         | Add: `server.put('/expense-subcategories/:subCategoryId', updateExpenseSubcategoryHandler)`                          |           |      |

Phase 1 Completion criteria (measurable):

- All three files exist and compile (tsc)
- `updateExpenseSubcategorySchema` has zod assertions for `subCategoryId`, `userId`, `accountId`, `name`
- Handler returns 400 for validation errors, using `errorStatusMapper` mapping

### Implementation Phase 2 - Service + Repository + Mapper

- GOAL-002: Implement business logic and DB update.

| Task     | Description                                   | File path                                                                                    | Function / Export                                                                                                                                        | Completed | Date |
| -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-004 | Implement service repository call             | `packages/backend/src/expenseSubCategories/service/updateExpenseSubcategoryService.ts`       | `export async function updateExpenseSubcategoryService(input: UpdateExpenseSubcategoryInput): Promise<ExpenseSubCategory>`                               |           |      |
| TASK-005 | Implement repository update using drizzle     | `packages/backend/src/expenseSubCategories/repository/updateExpenseSubcategoryRepository.ts` | `export async function updateExpenseSubcategoryRepo(subCategoryId: string, patch: { name: string; accountId: string; userId: string; }): Promise<DBRow>` |           |      |
| TASK-006 | Add/Reuse mapper to map DB row -> domain type | `packages/backend/src/expenseSubCategories/mappers/expenseSubCategoryMapper.ts`              | `export function mapDbRowToExpenseSubCategory(row): ExpenseSubCategory`                                                                                  |           |      |

Service validation rules and checks (explicit):

- Verify row exists by calling repository select by id (function name: `getExpenseSubCategoryByIdRepo`) — if not found -> throw notFoundError.
- Build patch object with allowed updatable fields (name only for this task) and call `updateExpenseSubcategoryRepo`
- Map DB result via `mapDbRowToExpenseSubCategory` and return

Phase 2 Completion criteria:

- Unit tests for service covering: not found, unauthorized, repository failure, successful update
- Repository uses drizzle `.update(...)` with where id equals `subCategoryId` and returns the updated row (or re-selects after update)

### Implementation Phase 3 - Tests + E2E

- GOAL-003: Add unit tests and e2e test verifying full flow.

| Task     | Description               | File path                                                                                                   | Test name                                                             | Completed |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | --------- |
| TASK-007 | Unit tests for validation | `packages/backend/src/expenseSubCategories/validation/__tests__/updateExpenseSubcategoryValidation.test.ts` | describe: "when input is invalid" - it blocks invalid uuid/empty name |           |
| TASK-008 | Unit tests for handler    | `packages/backend/src/expenseSubCategories/handler/__tests__/updateExpenseSubcategoryHandler.test.ts`       | describe: "when validation/service throws" etc                        |           |
| TASK-009 | Unit tests for service    | `packages/backend/src/expenseSubCategories/service/__tests__/updateExpenseSubcategoryService.test.ts`       | test ownership and success                                            |           |
| TASK-010 | Unit tests for repository | `packages/backend/src/expenseSubCategories/repository/__tests__/updateExpenseSubcategoryRepository.test.ts` | test drizzle update path and error mapping (mock db)                  |           |
| TASK-011 | Add e2e Playwright test   | `packages/backend/e2e/updateExpenseSubcategory.spec.ts`                                                     | test full request/response with real DB test fixture                  |           |

Phase 3 Completion criteria:

- All new unit tests pass locally (run `npm run test:unit` in `packages/backend`)
- E2E test runs and passes in CI or local (run `npm run test:e2e`), or at minimum the test file is present and wired into e2e runner

## 3. Alternatives

- **ALT-001**: Perform ownership check in DB `update` query using WHERE userId/accountId = input -> simpler, saves a read-before-write but makes error messages less precise. Rejected because we want explicit 403 vs 404 separation and clearer error handling.
- **ALT-002**: Accept partial updates (PATCH) for multiple fields. Rejected for scope: this task requires only `name` update per spec.

## 4. Dependencies

- **DEP-001**: `drizzle` DB client already used in repo. Repository will use `packages/backend/src/db/index.ts` export (assumed `db`) for queries.
- **DEP-002**: `zod` for validation (already used elsewhere in repo).
- **DEP-003**: `utilities/errorStatusMapper.ts` to convert thrown errors to HTTP status codes.

## 5. Files (explicit list to create/modify)

- FILE-001: `packages/backend/src/expenseSubCategories/validation/updateExpenseSubcategoryValidation.ts` (zod schema + validate function)
- FILE-002: `packages/backend/src/expenseSubCategories/handler/updateExpenseSubcategoryHandler.ts` (handler + export)
- FILE-003: `packages/backend/src/expenseSubCategories/service/updateExpenseSubcategoryService.ts` (business logic)
- FILE-004: `packages/backend/src/expenseSubCategories/repository/updateExpenseSubcategoryRepository.ts` (drizzle update/select)
- FILE-005: `packages/backend/src/expenseSubCategories/mappers/expenseSubCategoryMapper.ts` (or update existing mapper)
- FILE-006: `packages/backend/src/expenseSubCategories/handler/__tests__/updateExpenseSubcategoryHandler.test.ts`
- FILE-007: `packages/backend/src/expenseSubCategories/validation/__tests__/updateExpenseSubcategoryValidation.test.ts`
- FILE-008: `packages/backend/src/expenseSubCategories/service/__tests__/updateExpenseSubcategoryService.test.ts`
- FILE-009: `packages/backend/src/expenseSubCategories/repository/__tests__/updateExpenseSubcategoryRepository.test.ts`
- FILE-010: `packages/backend/e2e/updateExpenseSubcategory.spec.ts`
- FILE-011: `packages/backend/src/server.ts` (route registration) — small edit to register route

## 6. Testing

- **TEST-001**: Validation tests (invalid uuid, missing fields, empty name) => expects validation error
- **TEST-002**: Handler tests
  - when validation throws -> handler returns error with mapped status
  - when service throws -> handler returns error with mapped status
  - when success -> handler returns 200 and updated entity
- **TEST-003**: Service tests
  - when repo select returns null -> throws notFoundError
  - when ownership mismatch -> throws authorizationError
  - when repo update fails -> bubbles error
  - when repo update succeeds -> returns mapped domain object
- **TEST-004**: Repository tests
  - mock/spy drizzle's `update` to assert correct where clause and returned row
  - when DB throws -> repository surfaces an error
- **TEST-005**: E2E test
  - Create a test user/account/category/subcategory fixture
  - Call PUT /expense-subcategories/:subCategoryId with valid body
  - Expect 200 and response body containing updated name and unchanged IDs

Automated verification commands (to run locally in `packages/backend`):

```bash
# Run unit tests
npm run test:unit

# Run e2e tests (ensure test DB env configured)
npm run test:e2e
```

## 7. Risks & Assumptions

- **RISK-001**: DB schema differences (column names) may require mapper adjustments. Mitigation: inspect `packages/backend/src/db/schema.ts` before implementing repository.
- **RISK-002**: Route registration location may differ; search for existing domain route registrations. Mitigation: register in `server.ts` or domain router file following existing patterns.
- **ASSUMPTION-001**: `drizzle` instance exported from `packages/backend/src/db/index.ts` as `db`.
- **ASSUMPTION-002**: Project uses zod and existing error wrapper utilities.

## 8. Related Specifications / Further Reading

- `packages/backend/.github/prompts/existing_domain_endpoint.prompt.md` (project endpoint template)
- `packages/backend/src/expenseSubCategories` existing handlers, services and repositories for style references
- `packages/backend/src/utilities/errorStatusMapper.ts`

---

Validation checks for plan consumption (machine-parseable checklist):

- PLAN-REQ-001: All listed file paths are present in the plan.
- PLAN-REQ-002: Each TASK-### row has a file path and function/export name.
- PLAN-REQ-003: Each phase includes measurable completion criteria.

To execute: implement the files in the listed paths, follow the function and naming contracts, add tests and run unit/e2e suites.
