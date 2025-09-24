---
goal: Update frontend service to delete expense categories via API gateway instead of repository
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: AI Assistant
status: 'Planned'
tags: ['feature', 'frontend', 'api', 'gateway', 'expense-categories']
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan outlines the implementation to update the frontend `deleteCategory` service function to delete expense categories via a new API gateway function instead of directly calling the repository. This change will transition the expense categories deletion from local IndexedDB storage to API-based deletion, ensuring data consistency with the backend.

## 1. Requirements & Constraints

- **REQ-001**: The `deleteCategory` service function in `/packages/frontend/src/service/categories/deleteCategory.ts` must be updated to call a new gateway function `deleteExpenseCategory` instead of the repository function.
- **REQ-002**: Create a new gateway function `deleteExpenseCategory` in `/packages/frontend/src/gateway/expenseCategory/deleteExpenseCategory.ts` that handles API communication.
- **REQ-003**: Create contract types for the DELETE expense categories API response in `/contracts/expenseCategory/deleteExpenseCategory.ts`.
- **REQ-004**: Create a mapper function to convert contract response types to domain `ExpenseCategory` from `expenseData.ts`.
- **REQ-005**: The gateway function must accept request parameters (userId, accountId, id) to match the backend endpoint requirements.
- **REQ-006**: Update the service function signature to take `id: string` and return `ExpenseCategory`.
- **REQ-007**: Implement unit tests for all new files created and updated files.
- **CON-001**: The implementation must follow the established coding guidelines (TypeScript, named exports, camelCase, etc.).
- **CON-002**: All new code must include appropriate error handling and logging.
- **GUD-001**: Use early returns for error handling in async operations.
- **GUD-002**: Write clean, maintainable code with descriptive variable names.
- **PAT-001**: Follow the existing pattern from `createExpenseCategory.ts` gateway function.

## 2. Implementation Steps

### Implementation Phase 1: Create Infrastructure Components

- GOAL-001: Establish the foundational components (contracts, mapper) required for API-based expense category deletion.

| Task     | Description                                                                                                                                                                                       | Completed  | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| TASK-001 | Create contract types for DELETE expense categories API in `/contracts/expenseCategory/deleteExpenseCategory.ts` with `DeleteExpenseCategoryResponse` interface                                   | Yes        | 2025-09-23 |
| TASK-002 | Create mapper function `deleteExpenseCategoryResponseToDomainExpenseCategory` in `/packages/frontend/src/gateway/mappers/expenseCategory/deleteExpenseCategoryResponseToDomainExpenseCategory.ts` | Yes        | 2025-09-23 |
| TASK-003 | Create unit tests for the contract types (if needed)                                                                                                                                              | Not needed | 2025-09-23 |
| TASK-004 | Create unit tests for the mapper function in `/packages/frontend/src/gateway/mappers/expenseCategory/__tests__/deleteExpenseCategoryResponseToDomainExpenseCategory.test.ts`                      | Yes        | 2025-09-23 |

### Implementation Phase 2: Implement Gateway Function

- GOAL-002: Implement the core gateway function that orchestrates the API call and data transformation.

| Task     | Description                                                                                                                                                                                             | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-005 | Create `deleteExpenseCategory` gateway function in `/packages/frontend/src/gateway/expenseCategory/deleteExpenseCategory.ts` that accepts `DeleteExpenseCategoryRequest` with userId, accountId, and id | Yes       | 2025-09-23 |
| TASK-006 | Implement the gateway function to use the POST helper to call 'deleteexpensecategory' endpoint with request body                                                                                        | Yes       | 2025-09-23 |
| TASK-007 | Apply the mapper to transform the response to `ExpenseCategory`                                                                                                                                         | Yes       | 2025-09-23 |
| TASK-008 | Add proper error handling and logging in the gateway function                                                                                                                                           | Yes       | 2025-09-23 |
| TASK-009 | Create unit tests for the gateway function in `/packages/frontend/src/gateway/expenseCategory/__tests__/deleteExpenseCategory.test.ts`                                                                  | Yes       | 2025-09-23 |

### Implementation Phase 3: Update Service Function

- GOAL-003: Modify the service function to use the new gateway instead of repository.

| Task     | Description                                                                                                                                                | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-010 | Update `deleteCategory` service function in `/packages/frontend/src/service/categories/deleteCategory.ts` to call `deleteExpenseCategory` gateway function | Yes       | 2025-09-23 |
| TASK-011 | Change the function signature to accept `id: string` and return `ExpenseCategory`                                                                          | Yes       | 2025-09-23 |
| TASK-012 | Update the function to pass required request parameters (userId, accountId, id) - these may need to be obtained from context/store                         | Yes       | 2025-09-23 |
| TASK-013 | Update unit tests for the service function in `/packages/frontend/src/service/categories/__tests__/deleteCategory.test.ts`                                 | Yes       | 2025-09-23 |

## 3. Alternatives

- **ALT-001**: Keep using repository for local storage and sync with API separately - rejected because the requirement is to update deletion to use API gateway.

## 4. Dependencies

- **DEP-001**: Existing POST helper function in `/packages/frontend/src/gateway/post.ts`
- **DEP-002**: Domain types from `/packages/frontend/src/types/expenseData.ts`

## 5. Files

- **FILE-001**: `/contracts/expenseCategory/deleteExpenseCategory.ts` - New contract types
- **FILE-002**: `/packages/frontend/src/gateway/mappers/expenseCategory/deleteExpenseCategoryResponseToDomainExpenseCategory.ts` - New mapper function
- **FILE-003**: `/packages/frontend/src/gateway/expenseCategory/deleteExpenseCategory.ts` - New gateway function
- **FILE-004**: `/packages/frontend/src/service/categories/deleteCategory.ts` - Updated service function
- **FILE-005**: Various test files for new and updated components

## 6. Testing

- **TEST-001**: Unit tests for contract types (if applicable)
- **TEST-002**: Unit tests for mapper function
- **TEST-003**: Unit tests for gateway function
- **TEST-004**: Unit tests for updated service function

## 7. Risks & Assumptions

- **RISK-001**: Backend endpoint may not match expected request/response format - requires verification
- **ASSUMPTION-001**: POST method is correct for delete operation as specified in requirements

## 8. Related Specifications / Further Reading

- [feature-connect-get-expense-categories-api-1.md](feature-connect-get-expense-categories-api-1.md) - Similar implementation for get expense categories
- [createExpenseCategory.ts](../packages/frontend/src/gateway/expenseCategory/createExpenseCategory.ts) - Example gateway function pattern
