---
goal: Connect Frontend Expense Category Service to Backend API
version: 1.0
date_created: 2025-09-22
last_updated: 2025-09-22
owner: frontend-team
status: 'Planned'
tags: ['feature', 'expense-category', 'frontend', 'api-integration']
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan outlines the implementation required to connect the frontend expense category service to call the backend API endpoint `createexpensecategory` instead of only storing data locally. The implementation will follow the established patterns in the codebase, creating contracts, gateway functions, and updating the service layer to integrate with the server API while maintaining backward compatibility and proper error handling.

## 1. Requirements & Constraints

- **REQ-001**: Create contract types in `/contracts/expenseCategory/` that match the backend `createexpensecategory` endpoint response structure
- **REQ-002**: Update `addNewCategories.ts` service function to call backend API via new gateway function instead of only using local storage
- **REQ-003**: Create new gateway function following the pattern established in `/packages/frontend/src/gateway/expense/createExpense.ts`
- **REQ-004**: Build request object in service using `getStore().getAccountDetails()` to get `userId` and `accountId` following `addNewExpense.ts` pattern
- **REQ-005**: Create mapper function to transform backend response to frontend domain types

- **REQ-007**: All new files must have comprehensive unit tests following project testing conventions
- **SEC-001**: Ensure proper error handling for network failures and validation errors
- **CON-001**: Follow established naming conventions (camelCase for variables/functions, subCategory with capital C)
- **CON-002**: Use named exports only, no default exports
- **CON-003**: Follow project's TypeScript standards and error handling patterns
- **GUD-001**: Structure files according to existing folder hierarchy patterns
- **GUD-002**: Follow Jest unit testing patterns with describe/it blocks and proper mock prefixes
- **PAT-001**: Follow the established contract → gateway → service → repository pattern

## 2. Implementation Steps

### Implementation Phase 1: Contracts Layer

- GOAL-001: Create contract definitions for expense category API responses

| Task     | Description                                                                                                                         | Completed | Date       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Create `/contracts/expenseCategory/` subdirectory                                                                                   | ✅        | 2025-09-22 |
| TASK-002 | Create `/contracts/expenseCategory/createExpenseCategory.ts` with `CreateExpenseCategoryResponse` interface matching backend format | ✅        | 2025-09-22 |

### Implementation Phase 2: Gateway Layer

- GOAL-002: Implement gateway functions for expense category API calls

| Task     | Description                                                                                                                                   | Completed | Date       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-004 | Create `/packages/frontend/src/gateway/expenseCategory/` subdirectory                                                                         | ✅        | 2025-09-22 |
| TASK-005 | Create `/packages/frontend/src/gateway/expenseCategory/createExpenseCategory.ts` with request interface and gateway function                  | ✅        | 2025-09-22 |
| TASK-006 | Create `/packages/frontend/src/gateway/mappers/expenseCategory/` subdirectory                                                                 | ✅        | 2025-09-22 |
| TASK-007 | Create `/packages/frontend/src/gateway/mappers/expenseCategory/createExpenseCategoryResponseToDomainCategory.ts` mapper function              | ✅        | 2025-09-22 |
| TASK-008 | Create unit tests in `/packages/frontend/src/gateway/expenseCategory/__tests__/createExpenseCategory.test.ts`                                 | ✅        | 2025-09-22 |
| TASK-009 | Create unit tests in `/packages/frontend/src/gateway/mappers/expenseCategory/__tests__/createExpenseCategoryResponseToDomainCategory.test.ts` | ✅        | 2025-09-22 |

### Implementation Phase 3: Service Layer Updates

- GOAL-003: Update service layer to integrate with backend API

| Task     | Description                                                                                                                                         | Completed | Date |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-010 | Update `/packages/frontend/src/service/categories/addNewCategories.ts` to call backend API via gateway function                                     |           |      |
| TASK-011 | Implement request object building with `userId` and `accountId` from store, following `addNewExpense.ts` pattern                                    |           |      |
| TASK-012 | Add error handling for API failures and network issues                                                                                              |           |      |
| TASK-013 | Update or create unit tests in `/packages/frontend/src/service/categories/__tests__/addNewCategories.test.ts` to cover new API integration behavior |           |      |

### Implementation Phase 4: Type System Updates

- GOAL-004: Ensure type compatibility between frontend and backend systems

| Task     | Description                                                                                       | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-014 | Review and update `/packages/frontend/src/types/expenseData.ts` if needed for backend integration |           |      |

### Implementation Phase 5: Error Handling & Validation

- GOAL-005: Implement comprehensive error handling and validation

| Task | Description | Completed | Date |
| ---- | ----------- | --------- | ---- |

| TASK-018 | Add network error handling with appropriate user-friendly error messages | | |

| TASK-020 | Add unit tests for error scenarios and edge cases | | |

## 3. Alternatives

## 4. Dependencies

- **DEP-001**: Backend `createexpensecategory` endpoint must be functional and accessible at `/createexpensecategory`
- **DEP-002**: Backend endpoint must return the expected response structure matching `ExpenseCategory` domain model
- **DEP-003**: Frontend store must provide valid `userId` and `accountId` via `getStore().getAccountDetails()`
- **DEP-004**: Existing `post` utility function in `/packages/frontend/src/gateway/post.ts` must be available

## 5. Files

- **FILE-001**: `/contracts/expenseCategory/createExpenseCategory.ts` - Contract definitions for API response types
- **FILE-002**: `/packages/frontend/src/gateway/expenseCategory/createExpenseCategory.ts` - Gateway function for API calls
- **FILE-003**: `/packages/frontend/src/gateway/mappers/expenseCategory/createExpenseCategoryResponseToDomainCategory.ts` - Response mapper
- **FILE-004**: `/packages/frontend/src/service/categories/addNewCategories.ts` - Updated service to use API
- **FILE-005**: `/packages/frontend/src/gateway/expenseCategory/__tests__/createExpenseCategory.test.ts` - Gateway unit tests
- **FILE-006**: `/packages/frontend/src/gateway/mappers/expenseCategory/__tests__/createExpenseCategoryResponseToDomainCategory.test.ts` - Mapper unit tests
- **FILE-007**: `/packages/frontend/src/service/categories/__tests__/addNewCategories.test.ts` - Updated service unit tests

## 6. Testing

- **TEST-001**: Unit tests for contract type definitions and interfaces
- **TEST-002**: Unit tests for gateway function covering success and error scenarios
- **TEST-003**: Unit tests for response mapper function ensuring correct data transformation
- **TEST-004**: Unit tests for updated service function with mocked gateway calls
- **TEST-006**: Error handling tests for network failures, validation errors, and server errors
- **TEST-007**: Type compatibility tests ensuring frontend and backend types align correctly

## 7. Risks & Assumptions

- **RISK-001**: Backend API response structure might change, breaking frontend integration
- **RISK-002**: Network failures could disrupt category creation functionality
- **RISK-003**: Performance impact of API calls compared to local storage operations
- **RISK-004**: Potential data inconsistency if local storage contains data not synced with backend
- **ASSUMPTION-001**: Backend `createexpensecategory` endpoint accepts single category creation (not batch)
- **ASSUMPTION-002**: Frontend `Category` interface structure is compatible with backend `ExpenseCategory` domain model
- **ASSUMPTION-003**: Store provides consistent and valid user authentication data
- **ASSUMPTION-004**: Existing components using `addNewCategories` service can handle async behavior correctly

## 8. Related Specifications / Further Reading

- [Backend Create Expense Category Implementation Plan](/plan/feature-create-expense-category-1.md)
- [Frontend Gateway Pattern Examples](/packages/frontend/src/gateway/expense/createExpense.ts)
- [Project Coding Guidelines](/.github/copilot-instructions.md)
- [TypeScript Configuration](/packages/frontend/tsconfig.json)
