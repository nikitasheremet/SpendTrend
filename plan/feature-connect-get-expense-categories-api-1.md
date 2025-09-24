---
goal: Update frontend service to fetch expense categories via API gateway instead of repository
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: AI Assistant
status: 'Planned'
tags: ['feature', 'frontend', 'api', 'gateway', 'expense-categories']
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan outlines the implementation to update the frontend `getCategories` service function to fetch expense categories via a new API gateway function instead of directly calling the repository. This change will transition the expense categories fetching from local IndexedDB storage to API-based retrieval, ensuring data consistency with the backend.

## 1. Requirements & Constraints

- **REQ-001**: The `getCategories` service function in `/packages/frontend/src/service/categories/getCategories.ts` must be updated to call a new gateway function `getExpenseCategories` instead of the repository function.
- **REQ-002**: Create a new gateway function `getExpenseCategories` in `/packages/frontend/src/gateway/expenseCategory/getExpenseCategories.ts` that handles API communication.
- **REQ-003**: Create a GET helper function in `/packages/frontend/src/gateway/get.ts` similar to the existing `post.ts` helper for making HTTP GET requests.
- **REQ-004**: Create contract types for the GET expense categories API response in `/contracts/expenseCategory/getExpenseCategories.ts`.
- **REQ-005**: Create a mapper function to convert contract response types to domain `ExpenseCategory[]` from `expenseData.ts`.
- **REQ-006**: The gateway function must accept request parameters (userId, accountId) to match the backend endpoint requirements.
- **REQ-007**: Update the service function return type from `Category[]` to `ExpenseCategory[]`.
- **REQ-008**: Implement unit tests for all new files created and updated files.
- **CON-001**: The implementation must follow the established coding guidelines (TypeScript, named exports, camelCase, etc.).
- **CON-002**: All new code must include appropriate error handling and logging.
- **GUD-001**: Use early returns for error handling in async operations.
- **GUD-002**: Write clean, maintainable code with descriptive variable names.
- **PAT-001**: Follow the existing pattern from `createExpenseCategory.ts` gateway function.

## 2. Implementation Steps

### Implementation Phase 1: Create Infrastructure Components

- GOAL-001: Establish the foundational components (GET helper, contracts, mapper) required for API-based expense category fetching.

| Task     | Description                                                                                                                                                                                         | Completed  | Date       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| TASK-001 | Create GET helper function in `/packages/frontend/src/gateway/get.ts` following the pattern of `post.ts`                                                                                            | Yes        | 2025-09-23 |
| TASK-002 | Create contract types for GET expense categories API in `/contracts/expenseCategory/getExpenseCategories.ts` with `GetExpenseCategoriesResponse` interface                                          | Yes        | 2025-09-23 |
| TASK-003 | Create mapper function `getExpenseCategoriesResponseToDomainExpenseCategories` in `/packages/frontend/src/gateway/mappers/expenseCategory/getExpenseCategoriesResponseToDomainExpenseCategories.ts` | Yes        | 2025-09-23 |
| TASK-004 | Create unit tests for the GET helper function in `/packages/frontend/src/gateway/__tests__/get.test.ts`                                                                                             | Yes        | 2025-09-23 |
| TASK-005 | Create unit tests for the contract types (if needed)                                                                                                                                                | Not needed | 2025-09-23 |
| TASK-006 | Create unit tests for the mapper function in `/packages/frontend/src/gateway/mappers/expenseCategory/__tests__/getExpenseCategoriesResponseToDomainExpenseCategories.test.ts`                       | Yes        | 2025-09-23 |

### Implementation Phase 2: Implement Gateway Function

- GOAL-002: Implement the core gateway function that orchestrates the API call and data transformation.

| Task     | Description                                                                                                                                                                                     | Completed | Date       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-007 | Create `getExpenseCategories` gateway function in `/packages/frontend/src/gateway/expenseCategory/getExpenseCategories.ts` that accepts `GetExpenseCategoriesRequest` with userId and accountId | Yes       | 2025-09-23 |
| TASK-008 | Implement the gateway function to use the GET helper to call 'getexpensecategories' endpoint with query parameters                                                                              | Yes       | 2025-09-23 |
| TASK-009 | Apply the mapper to transform the response to `ExpenseCategory[]`                                                                                                                               | Yes       | 2025-09-23 |
| TASK-010 | Add proper error handling and logging in the gateway function                                                                                                                                   | Yes       | 2025-09-23 |
| TASK-011 | Create unit tests for the gateway function in `/packages/frontend/src/gateway/expenseCategory/__tests__/getExpenseCategories.test.ts`                                                           | Yes       | 2025-09-23 |

### Implementation Phase 3: Update Service Function

- GOAL-003: Modify the service function to use the new gateway instead of repository.

| Task     | Description                                                                                                                                             | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-012 | Update `getCategories` service function in `/packages/frontend/src/service/categories/getCategories.ts` to call `getExpenseCategories` gateway function | Yes       | 2025-09-23 |
| TASK-013 | Change the return type from `Category[]` to `ExpenseCategory[]`                                                                                         | Yes       | 2025-09-23 |
| TASK-014 | Update the function to pass required request parameters (userId, accountId) - these may need to be obtained from context/store                          | Yes       | 2025-09-23 |
| TASK-015 | Update unit tests for the service function in `/packages/frontend/src/service/categories/__tests__/getCategories.test.ts`                               | Yes       | 2025-09-23 |

## 3. Alternatives

- **ALT-001**: Keep using repository for local storage and sync with API separately - rejected because the requirement is to update fetching to use API gateway.
- **ALT-002**: Implement the gateway in the backend instead of frontend - rejected because the service function specified is in the frontend.
- **ALT-003**: Use a generic HTTP client instead of specific GET helper - rejected to maintain consistency with existing `post.ts` pattern.

## 4. Dependencies

- **DEP-001**: Existing `post.ts` helper for reference pattern
- **DEP-002**: Existing `createExpenseCategory.ts` gateway for implementation pattern
- **DEP-003**: Backend `/getexpensecategories` endpoint must be available and functional
- **DEP-004**: User context/store must provide userId and accountId for API calls

## 5. Files

- **FILE-001**: `/packages/frontend/src/gateway/get.ts` (new)
- **FILE-002**: `/contracts/expenseCategory/getExpenseCategories.ts` (new)
- **FILE-003**: `/packages/frontend/src/gateway/mappers/expenseCategory/getExpenseCategoriesResponseToDomainExpenseCategories.ts` (new)
- **FILE-004**: `/packages/frontend/src/gateway/expenseCategory/getExpenseCategories.ts` (new)
- **FILE-005**: `/packages/frontend/src/service/categories/getCategories.ts` (update)
- **FILE-006**: `/packages/frontend/src/gateway/__tests__/get.test.ts` (new)
- **FILE-007**: `/packages/frontend/src/gateway/mappers/expenseCategory/__tests__/getExpenseCategoriesResponseToDomainExpenseCategories.test.ts` (new)
- **FILE-008**: `/packages/frontend/src/gateway/expenseCategory/__tests__/getExpenseCategories.test.ts` (new)
- **FILE-009**: `/packages/frontend/src/service/categories/__tests__/getCategories.test.ts` (update)

## 6. Testing

- **TEST-001**: Unit tests for GET helper function covering success and error scenarios
- **TEST-002**: Unit tests for mapper function covering response transformation
- **TEST-003**: Unit tests for gateway function covering API call and mapping
- **TEST-004**: Unit tests for updated service function
- **TEST-005**: Integration tests to verify end-to-end API flow (if applicable)

## 7. Risks & Assumptions

- **RISK-001**: Backend endpoint may not be fully implemented or may have different parameter requirements
- **RISK-002**: User context/store may not provide required userId and accountId
- **RISK-003**: Network failures could impact user experience compared to local storage
- **ASSUMPTION-001**: The backend endpoint accepts userId and accountId as query parameters
- **ASSUMPTION-002**: The contract ExpenseCategory structure matches the domain ExpenseCategory structure closely

## 8. Related Specifications / Further Reading

- Existing `post.ts` implementation for HTTP helper pattern
- Existing `createExpenseCategory.ts` gateway for implementation reference
- Backend handler `getExpenseCategoriesHandler` for endpoint specification</content>
  <parameter name="filePath">/Users/nikita/personal-finance/plan/feature-connect-get-expense-categories-api-1.md
