---
goal: Create a new endpoint for creating expense subcategories
version: 1.0
date_created: 2025-09-10
last_updated: 2025-09-10
owner: nikitasheremet
status: Completed
tags: feature, backend, expenseSubCategories, endpoint
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This implementation plan outlines the creation of a new endpoint `createsubcategory` in the expenseSubCategories domain. The endpoint will allow users to create new expense subcategories with required fields: userId (UUID), accountId (UUID), categoryId (UUID), and name (non-empty string). The implementation will mirror the structure and patterns used in the existing expense and expenseCategories domains, including handler, validation, service, repository layers, unit tests, and e2e tests.

## 1. Requirements & Constraints

- **REQ-001**: Endpoint must accept POST request to `/createsubcategory` with JSON body containing userId, accountId, categoryId, and name.
- **REQ-002**: userId must be a valid UUID and required.
- **REQ-003**: accountId must be a valid UUID and required.
- **REQ-004**: categoryId must be a valid UUID and required.
- **REQ-005**: name must be a non-empty string and required.
- **REQ-006**: Handler must validate input using Zod schema.
- **REQ-007**: Service must call repository to insert into expenseSubCategoriesTable.
- **REQ-008**: Repository must use Drizzle ORM for database operations.
- **REQ-009**: Response must return created subcategory object on success.
- **REQ-010**: Error handling must use errorStatusMapper for status codes.
- **REQ-011**: Unit tests must cover validation, service, repository, and handler layers.
- **REQ-012**: E2E tests must use Playwright and cover success and failure scenarios.
- **CON-001**: Mirror file structure of expense and expenseCategories domains.
- **CON-002**: Follow existing coding conventions (camelCase, named exports, etc.).
- **CON-003**: Use TypeScript for all new code.
- **CON-004**: Write unit tests using Jest with describe/it structure.
- **CON-005**: Write e2e tests using Playwright.
- **GUD-001**: Use Zod for input validation.
- **GUD-002**: Use Drizzle for database operations.
- **GUD-003**: Map database results to domain objects using mappers.
- **PAT-001**: Handler pattern: validate -> service -> response/error.
- **PAT-002**: Service pattern: call repository, return result.
- **PAT-003**: Repository pattern: insert -> map -> return.

## 2. Implementation Steps

### Implementation Phase 1: Create File Structure

- GOAL-001: Set up the directory structure for expenseSubCategories domain mirroring existing domains.

| Task     | Description                                                                             | Completed | Date |
| -------- | --------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-001 | Create /packages/backend/src/expenseSubCategories/ directory                            |           |      |
| TASK-002 | Create /packages/backend/src/expenseSubCategories/handler/ directory                    |           |      |
| TASK-003 | Create /packages/backend/src/expenseSubCategories/repository/ directory                 |           |      |
| TASK-004 | Create /packages/backend/src/expenseSubCategories/service/ directory                    |           |      |
| TASK-005 | Create /packages/backend/src/expenseSubCategories/validation/ directory                 |           |      |
| TASK-006 | Create /packages/backend/src/expenseSubCategories/validation/validationUtils/ directory |           |      |
| TASK-007 | Create /packages/backend/src/expenseSubCategories/**tests**/ directory                  |           |      |
| TASK-008 | Create /packages/backend/src/expenseSubCategories/**tests**/handler/ directory          |           |      |
| TASK-009 | Create /packages/backend/src/expenseSubCategories/**tests**/repository/ directory       |           |      |
| TASK-010 | Create /packages/backend/src/expenseSubCategories/**tests**/service/ directory          |           |      |
| TASK-011 | Create /packages/backend/src/expenseSubCategories/**tests**/validation/ directory       |           |      |

### Implementation Phase 2: Validation Layer

- GOAL-002: Implement input validation using Zod schemas.

| Task     | Description                                                                                                                     | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-012 | Create /packages/backend/src/expenseSubCategories/validation/validationUtils/userIdSchema.ts                                    |           |      |
| TASK-013 | Create /packages/backend/src/expenseSubCategories/validation/validationUtils/accountIdSchema.ts                                 |           |      |
| TASK-014 | Create /packages/backend/src/expenseSubCategories/validation/validationUtils/categoryIdSchema.ts                                |           |      |
| TASK-015 | Create /packages/backend/src/expenseSubCategories/validation/validationUtils/nameSchema.ts                                      |           |      |
| TASK-016 | Create /packages/backend/src/expenseSubCategories/validation/validationUtils/index.ts                                           |           |      |
| TASK-017 | Create /packages/backend/src/expenseSubCategories/validation/models.ts with createExpenseSubcategoryInputSchema                 |           |      |
| TASK-018 | Create /packages/backend/src/expenseSubCategories/validation/createExpenseSubcategoryValidation.ts                              |           |      |
| TASK-019 | Create /packages/backend/src/expenseSubCategories/validation/index.ts                                                           |           |      |
| TASK-020 | Create unit tests in /packages/backend/src/expenseSubCategories/**tests**/validation/createExpenseSubcategoryValidation.test.ts |           |      |

### Implementation Phase 3: Repository Layer

- GOAL-003: Implement database operations for creating subcategories.

| Task     | Description                                                                                                                     | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-021 | Create /packages/backend/src/expenseSubCategories/repository/createExpenseSubcategoryRepository.ts                              |           |      |
| TASK-022 | Create /packages/backend/src/expenseSubCategories/repository/index.ts                                                           |           |      |
| TASK-023 | Create unit tests in /packages/backend/src/expenseSubCategories/**tests**/repository/createExpenseSubcategoryRepository.test.ts |           |      |

### Implementation Phase 4: Service Layer

- GOAL-004: Implement business logic for creating subcategories.

| Task     | Description                                                                                                               | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-024 | Create /packages/backend/src/expenseSubCategories/service/createExpenseSubcategoryService.ts                              |           |      |
| TASK-025 | Create /packages/backend/src/expenseSubCategories/service/index.ts                                                        |           |      |
| TASK-026 | Create unit tests in /packages/backend/src/expenseSubCategories/**tests**/service/createExpenseSubcategoryService.test.ts |           |      |

### Implementation Phase 5: Handler Layer

- GOAL-005: Implement HTTP handler for the endpoint.

| Task     | Description                                                                                                               | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-027 | Create /packages/backend/src/expenseSubCategories/handler/createExpenseSubcategoryHandler.ts                              |           |      |
| TASK-028 | Create /packages/backend/src/expenseSubCategories/handler/index.ts                                                        |           |      |
| TASK-029 | Create unit tests in /packages/backend/src/expenseSubCategories/**tests**/handler/createExpenseSubcategoryHandler.test.ts |           |      |

### Implementation Phase 6: Register Endpoint

- GOAL-006: Register the new handler in the server.

| Task     | Description                                                                    | Completed | Date |
| -------- | ------------------------------------------------------------------------------ | --------- | ---- |
| TASK-030 | Update /packages/backend/src/server.ts to register the createsubcategory route |           |      |

### Implementation Phase 7: E2E Tests

- GOAL-007: Implement end-to-end tests for the new endpoint.

| Task     | Description                                                   | Completed | Date |
| -------- | ------------------------------------------------------------- | --------- | ---- |
| TASK-031 | Create /packages/backend/e2e/createExpenseSubcategory.spec.ts |           |      |

## 3. Alternatives

- **ALT-001**: Instead of mirroring the full structure, use a single file per layer. Rejected because it doesn't follow the established pattern in the codebase.
- **ALT-002**: Use a different validation library instead of Zod. Rejected because Zod is already used in the project.
- **ALT-003**: Implement the endpoint without unit tests initially. Rejected because the project requires unit tests for all features.

## 4. Dependencies

- **DEP-001**: Drizzle ORM for database operations (already installed).
- **DEP-002**: Zod for input validation (already installed).
- **DEP-003**: Koa for HTTP handling (already installed).
- **DEP-004**: Jest for unit testing (already installed).
- **DEP-005**: Playwright for e2e testing (already installed).
- **DEP-006**: Existing expenseSubCategoriesTable in database schema.
- **DEP-007**: Existing mappers for expenseSubCategory domain objects.

## 5. Files

- **FILE-001**: /packages/backend/src/expenseSubCategories/validation/validationUtils/userIdSchema.ts
- **FILE-002**: /packages/backend/src/expenseSubCategories/validation/validationUtils/accountIdSchema.ts
- **FILE-003**: /packages/backend/src/expenseSubCategories/validation/validationUtils/categoryIdSchema.ts
- **FILE-004**: /packages/backend/src/expenseSubCategories/validation/validationUtils/nameSchema.ts
- **FILE-005**: /packages/backend/src/expenseSubCategories/validation/validationUtils/index.ts
- **FILE-006**: /packages/backend/src/expenseSubCategories/validation/models.ts
- **FILE-007**: /packages/backend/src/expenseSubCategories/validation/createExpenseSubcategoryValidation.ts
- **FILE-008**: /packages/backend/src/expenseSubCategories/validation/index.ts
- **FILE-009**: /packages/backend/src/expenseSubCategories/repository/createExpenseSubcategoryRepository.ts
- **FILE-010**: /packages/backend/src/expenseSubCategories/repository/index.ts
- **FILE-011**: /packages/backend/src/expenseSubCategories/service/createExpenseSubcategoryService.ts
- **FILE-012**: /packages/backend/src/expenseSubCategories/service/index.ts
- **FILE-013**: /packages/backend/src/expenseSubCategories/handler/createExpenseSubcategoryHandler.ts
- **FILE-014**: /packages/backend/src/expenseSubCategories/handler/index.ts
- **FILE-015**: /packages/backend/src/server.ts
- **FILE-016**: /packages/backend/e2e/createExpenseSubcategory.spec.ts
- **FILE-017**: /packages/backend/src/expenseSubCategories/**tests**/validation/createExpenseSubcategoryValidation.test.ts
- **FILE-018**: /packages/backend/src/expenseSubCategories/**tests**/repository/createExpenseSubcategoryRepository.test.ts
- **FILE-019**: /packages/backend/src/expenseSubCategories/**tests**/service/createExpenseSubcategoryService.test.ts
- **FILE-020**: /packages/backend/src/expenseSubCategories/**tests**/handler/createExpenseSubcategoryHandler.test.ts

## 6. Testing

- **TEST-001**: Unit tests for validation function covering all input fields and failure conditions.
- **TEST-002**: Unit tests for repository function covering insert success and failure.
- **TEST-003**: Unit tests for service function covering repository call success and failure.
- **TEST-004**: Unit tests for handler function covering validation error, service error, and success.
- **TEST-005**: E2E tests for endpoint covering valid input, validation failure, and internal server error.

## 7. Risks & Assumptions

- **RISK-001**: Database schema may not have expenseSubCategoriesTable - assumed it exists based on existing e2e tests.
- **RISK-002**: Mappers for expenseSubCategory may not exist - assumed they exist in utilities/mappers/expenseSubCategory/.
- **ASSUMPTION-001**: The project follows the established patterns in expense and expenseCategories domains.
- **ASSUMPTION-002**: All required dependencies (Drizzle, Zod, etc.) are already installed and configured.

## 8. Related Specifications / Further Reading

- Existing expense domain implementation in /packages/backend/src/expense/
- Existing expenseCategories domain implementation in /packages/backend/src/expenseCategories/
- Database schema in /packages/backend/src/db/schema.ts
- Error handling in /packages/backend/src/utilities/errorStatusMapper.ts
- Validation errors in /packages/backend/src/models/errors/validationError.ts
