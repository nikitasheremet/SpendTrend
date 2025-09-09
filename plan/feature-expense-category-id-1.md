---
goal: Add id field to expense categories
version: 1.0
date_created: 2025-09-02
last_updated: 2025-09-02
owner: nikitasheremet
status: 'In progress'
tags: ['feature', 'database', 'schema', 'domain-model', 'refactor']
---

# Introduction

![Status: In progress](https://img.shields.io/badge/status-In%20progress-yellow)

This implementation plan outlines the steps to add a unique identifier (id) field to the expense categories in the personal finance application. The id will be a UUID primary key, consistent with the expenses table. This change requires updates to the database schema, domain model, all related handlers, repositories, services, validations, tests, and e2e tests in the expenseCategories domain.

## 1. Requirements & Constraints

- **REQ-001**: Add a UUID primary key 'id' field to the expenseCategoriesTable in schema.ts
- **REQ-002**: Update the domain model in expenseCategory.ts to include the id field
- **REQ-003**: Update all handlers, repositories, services, and validations in the expenseCategories domain to handle the id field
- **REQ-004**: Update all unit tests in the expenseCategories domain to reflect the id field changes
- **REQ-005**: Update e2e tests for createExpenseCategory and getExpenseCategories to include id field assertions
- **REQ-006**: Update the mapper dbExpenseCategoriesToDomainCategories.ts to map the id field
- **REQ-007**: Update models.ts in expenseCategories to reflect the id field
- **CON-001**: Maintain backward compatibility where possible, but since this is a schema change, data migration may be needed
- **GUD-001**: Follow existing naming conventions and TypeScript best practices
- **PAT-001**: Use UUID for id generation, consistent with expenses table

## 2. Implementation Steps

### Implementation Phase 1: Update Database Schema and Domain Model

- GOAL-001: Modify the database schema to include id field and update the domain model accordingly

| Task     | Description                                                                                                                                                                | Completed | Date       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Add id field as UUID primary key to expenseCategoriesTable in /Users/nikita/personal-finance/packages/backend/src/db/schema.ts                                             | ✅        | 2025-09-02 |
| TASK-002 | Update expenseCategory.ts in /Users/nikita/personal-finance/packages/backend/src/models/expenseCategory/ to include id field in the interface                              | ✅        | 2025-09-02 |
| TASK-003 | Update dbExpenseCategoriesToDomainCategories.ts in /Users/nikita/personal-finance/packages/backend/src/models/expenseCategory/ to map the id field from database to domain | ✅        | 2025-09-02 |

### Implementation Phase 2: Update Core Logic Components

- GOAL-002: Modify handlers, repositories, and services to handle the id field

| Task     | Description                                                                                                                                               | Completed | Date       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-004 | Update createExpenseCategoryHandler.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/handler/ to generate and return id        | ✅        | 2025-09-02 |
| TASK-005 | Update getExpenseCategoriesHandler.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/handler/ to include id in response         | ✅        | 2025-09-02 |
| TASK-006 | Update createExpenseCategoryRepository.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/repository/ to insert and return id    | ✅        | 2025-09-02 |
| TASK-007 | Update getExpenseCategoriesRepository.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/repository/ to select and return id     | ✅        | 2025-09-02 |
| TASK-008 | Update createExpenseCategoryService.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/service/ to handle id in business logic   | ✅        | 2025-09-02 |
| TASK-009 | Update getExpenseCategoriesService.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/service/ to include id in service response | ✅        | 2025-09-02 |
| TASK-010 | Update models.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/ to include id in type definitions                              | ✅        | 2025-09-02 |

### Implementation Phase 3: Update Validation Components

- GOAL-003: Modify validation schemas and utilities to account for the id field

| Task     | Description                                                                                                                                                                                                                                | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---------- |
| TASK-011 | Update createExpenseCategoryValidation.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/validation/ to handle id in input/output schemas                                                                        | ✅        | 2025-09-02 |
| TASK-012 | Update getExpenseCategoriesValidation.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/validation/ to include id in response schema                                                                             | ✅        | 2025-09-02 |
| TASK-013 | Update validationUtils schemas (accountIdSchema.ts, nameSchema.ts, subcategoriesSchema.ts, userIdSchema.ts) in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/validation/validationUtils/ if needed for id handling | ✅        | 2025-09-02 |

### Implementation Phase 4: Update Unit Tests

- GOAL-004: Modify all unit tests in the expenseCategories domain to reflect the id field changes

| Task     | Description                                                                                                                                                                      | Completed | Date       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-014 | Update createExpenseCategoryHandler.test.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/handler/ to test id generation and return         | ✅        | 2025-09-02 |
| TASK-015 | Update getExpenseCategoriesHandler.test.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/handler/ to test id inclusion in response          | ✅        | 2025-09-02 |
| TASK-016 | Update createExpenseCategoryRepository.test.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/repository/ to test id insertion and retrieval | ✅        | 2025-09-02 |
| TASK-017 | Update getExpenseCategoriesRepository.test.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/repository/ to test id selection                | ✅        | 2025-09-02 |
| TASK-018 | Update createExpenseCategoryService.test.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/service/ to test id in service logic              | ✅        | 2025-09-02 |
| TASK-019 | Update getExpenseCategoriesService.test.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/service/ to test id in service response            | ✅        | 2025-09-02 |
| TASK-020 | Update createExpenseCategoryValidation.test.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/validation/ to test id validation              | ✅        | 2025-09-02 |
| TASK-021 | Update getExpenseCategoriesValidation.test.ts in /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/validation/ to test id in response validation   | ✅        | 2025-09-02 |

### Implementation Phase 5: Update E2E Tests

- GOAL-005: Modify e2e tests to include assertions for the id field

| Task     | Description                                                                                                                                     | Completed | Date       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-022 | Update createExpenseCategory.spec.ts in /Users/nikita/personal-finance/packages/backend/e2e/ to assert id is returned and valid UUID            | ✅        | 2025-09-02 |
| TASK-023 | Update getExpenseCategories.spec.ts in /Users/nikita/personal-finance/packages/backend/e2e/ to assert id is included in response and valid UUID | ✅        | 2025-09-02 |

## 3. Alternatives

- **ALT-001**: Use auto-incrementing integer id instead of UUID - Rejected because it doesn't align with the existing expenses table pattern and UUID provides better distribution for database sharding
- **ALT-002**: Make id optional in domain model - Rejected because id should be required for all expense categories to maintain consistency

## 4. Dependencies

- **DEP-001**: Drizzle ORM for schema updates
- **DEP-002**: UUID generation library (likely already available via drizzle-orm/pg-core)
- **DEP-003**: Database migration tool for applying schema changes

## 5. Files

- **FILE-001**: /Users/nikita/personal-finance/packages/backend/src/db/schema.ts - Add id field to expenseCategoriesTable
- **FILE-002**: /Users/nikita/personal-finance/packages/backend/src/models/expenseCategory/expenseCategory.ts - Update domain interface
- **FILE-003**: /Users/nikita/personal-finance/packages/backend/src/models/expenseCategory/dbExpenseCategoriesToDomainCategories.ts - Update mapper
- **FILE-004**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/handler/createExpenseCategoryHandler.ts - Update handler
- **FILE-005**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/handler/getExpenseCategoriesHandler.ts - Update handler
- **FILE-006**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/repository/createExpenseCategoryRepository.ts - Update repository
- **FILE-007**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/repository/getExpenseCategoriesRepository.ts - Update repository
- **FILE-008**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/service/createExpenseCategoryService.ts - Update service
- **FILE-009**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/service/getExpenseCategoriesService.ts - Update service
- **FILE-010**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/models.ts - Update type definitions
- **FILE-011**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/validation/createExpenseCategoryValidation.ts - Update validation
- **FILE-012**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/validation/getExpenseCategoriesValidation.ts - Update validation
- **FILE-013**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/validation/validationUtils/accountIdSchema.ts - Update if needed
- **FILE-014**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/validation/validationUtils/nameSchema.ts - Update if needed
- **FILE-015**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/validation/validationUtils/subcategoriesSchema.ts - Update if needed
- **FILE-016**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/validation/validationUtils/userIdSchema.ts - Update if needed
- **FILE-017**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/handler/createExpenseCategoryHandler.test.ts - Update tests
- **FILE-018**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/handler/getExpenseCategoriesHandler.test.ts - Update tests
- **FILE-019**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/repository/createExpenseCategoryRepository.test.ts - Update tests
- **FILE-020**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/repository/getExpenseCategoriesRepository.test.ts - Update tests
- **FILE-021**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/service/createExpenseCategoryService.test.ts - Update tests
- **FILE-022**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/service/getExpenseCategoriesService.test.ts - Update tests
- **FILE-023**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/validation/createExpenseCategoryValidation.test.ts - Update tests
- **FILE-024**: /Users/nikita/personal-finance/packages/backend/src/expenseCategories/**tests**/validation/getExpenseCategoriesValidation.test.ts - Update tests
- **FILE-025**: /Users/nikita/personal-finance/packages/backend/e2e/createExpenseCategory.spec.ts - Update e2e test
- **FILE-026**: /Users/nikita/personal-finance/packages/backend/e2e/getExpenseCategories.spec.ts - Update e2e test

## 6. Testing

- **TEST-001**: Unit tests for all updated handlers, repositories, services, and validations to ensure id field is properly handled
- **TEST-002**: E2E tests to verify id is generated on creation and returned in get operations
- **TEST-003**: Integration tests to ensure database operations work correctly with the new id field
- **TEST-004**: Validation tests to ensure id conforms to UUID format

## 7. Risks & Assumptions

- **RISK-001**: Existing data in expense_categories table will need migration to add id values - Assumed that a database migration script will be created separately
- **ASSUMPTION-001**: UUID generation is handled automatically by the database or ORM - If not, additional code for UUID generation may be needed
- **RISK-002**: Frontend may need updates to handle id field in API responses - Out of scope for this plan, assumed to be handled separately

## 8. Related Specifications / Further Reading

- Existing expense schema implementation in schema.ts
- Domain model patterns in models/expenseCategory/
- Testing patterns in **tests**/ directories
- E2E testing setup in e2e/ directory
