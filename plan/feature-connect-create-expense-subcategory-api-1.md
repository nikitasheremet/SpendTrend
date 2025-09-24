---
goal: Update addNewSubcategories Service to Connect to Backend API for Creating Expense Subcategories
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: frontend-team
status: 'Planned'
tags: ['feature', 'expense-subcategory', 'frontend', 'api-integration']
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan outlines the implementation required to update the `addNewSubcategories` service function to connect to the backend API for creating expense subcategories. The function will be renamed to `addNewSubcategory` (singular), modified to take `categoryId` and `subCategoryName` parameters, and return the created `ExpenseSubCategory`. The implementation will follow established patterns in the codebase, creating contracts, gateway functions, and updating the service layer to integrate with the server API while maintaining proper error handling.

## 1. Requirements & Constraints

- **REQ-001**: Create contract types in `/contracts/expenseSubCategory/` that match the backend `createexpensesubcategory` endpoint response structure
- **REQ-002**: Rename `addNewSubcategories.ts` to `addNewSubcategory.ts` and update function signature to accept `categoryId` and `subCategoryName`, returning `ExpenseSubCategory`
- **REQ-003**: Create new gateway function in `/packages/frontend/src/gateway/expenseSubCategory/` following the pattern from `createExpenseCategory.ts`
- **REQ-004**: Gateway function should build request object with `userId`, `accountId`, `categoryId`, and `name` based on backend `CreateExpenseSubCategoryInput` requirements
- **REQ-005**: Create mapper function to transform backend response to frontend `ExpenseSubCategory` domain type
- **REQ-006**: Update service function to call backend API via new gateway function instead of local storage operations
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

- GOAL-001: Create contract definitions for expense subcategory API responses

| Task     | Description                                                                                                                                  | Completed | Date       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Create `/contracts/expenseSubCategory/` subdirectory                                                                                         | Yes       | 2025-09-23 |
| TASK-002 | Create `/contracts/expenseSubCategory/createExpenseSubCategory.ts` with `CreateExpenseSubCategoryResponse` interface matching backend format | Yes       | 2025-09-23 |
| TASK-003 | Create `/contracts/expenseSubCategory/models.ts` with `ExpenseSubCategory` interface matching backend model                                  | Yes       | 2025-09-23 |

### Implementation Phase 2: Gateway Layer

- GOAL-002: Implement gateway functions for expense subcategory API calls

| Task     | Description                                                                                                                                                   | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-004 | Create `/packages/frontend/src/gateway/expenseSubCategory/` subdirectory                                                                                      | Yes       | 2025-09-23 |
| TASK-005 | Create `/packages/frontend/src/gateway/expenseSubCategory/createExpenseSubCategory.ts` with request interface and gateway function                            | Yes       | 2025-09-23 |
| TASK-006 | Create `/packages/frontend/src/gateway/mappers/expenseSubCategory/` subdirectory                                                                              | Yes       | 2025-09-23 |
| TASK-007 | Create `/packages/frontend/src/gateway/mappers/expenseSubCategory/createExpenseSubCategoryResponseToDomainExpenseSubCategory.ts` mapper function              | Yes       | 2025-09-23 |
| TASK-008 | Create unit tests in `/packages/frontend/src/gateway/expenseSubCategory/__tests__/createExpenseSubCategory.test.ts`                                           | Yes       | 2025-09-23 |
| TASK-009 | Create unit tests in `/packages/frontend/src/gateway/mappers/expenseSubCategory/__tests__/createExpenseSubCategoryResponseToDomainExpenseSubCategory.test.ts` | Yes       | 2025-09-23 |

### Implementation Phase 3: Service Layer Updates

- GOAL-003: Update service layer to integrate with backend API

| Task     | Description                                                                                                                                          | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-010 | Rename `/packages/frontend/src/service/categories/addNewSubcategories.ts` to `addNewSubcategory.ts`                                                  | Yes       | 2025-09-23 |
| TASK-011 | Update function signature to accept `categoryId: string` and `subCategoryName: string` parameters                                                    | Yes       | 2025-09-23 |
| TASK-012 | Update return type to `Promise<ExpenseSubCategory>`                                                                                                  | Yes       | 2025-09-23 |
| TASK-013 | Implement request object building with `userId` and `accountId` from store, plus `categoryId` and `name`                                             | Yes       | 2025-09-23 |
| TASK-014 | Replace local storage logic with call to new gateway function                                                                                        | Yes       | 2025-09-23 |
| TASK-015 | Add error handling for API failures and network issues                                                                                               | Yes       | 2025-09-23 |
| TASK-016 | Update or create unit tests in `/packages/frontend/src/service/categories/__tests__/addNewSubcategory.test.ts` to cover new API integration behavior | Yes       | 2025-09-23 |

### Implementation Phase 4: Type System Updates

- GOAL-004: Ensure type compatibility between frontend and backend systems

| Task     | Description                                                                                                                                           | Completed | Date       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-017 | Review and update `/packages/frontend/src/types/expenseData.ts` ExpenseSubCategory interface if needed for backend integration (add categoryId field) | Yes       | 2025-09-23 |

### Implementation Phase 5: Error Handling & Validation

- GOAL-005: Implement comprehensive error handling and validation

| Task     | Description                                                              | Completed | Date |
| -------- | ------------------------------------------------------------------------ | --------- | ---- |
| TASK-018 | Add network error handling with appropriate user-friendly error messages |           |      |
| TASK-019 | Add input validation for categoryId and subCategoryName parameters       |           |      |
| TASK-020 | Add unit tests for error scenarios and edge cases                        |           |      |

## 3. Alternatives

- **ALT-001**: Keep the original function name and signature but add an optional parameter to control whether to use API or local storage - Rejected because it would complicate the API and doesn't align with the goal of migrating to API-first approach
- **ALT-002**: Create a separate new function instead of renaming - Rejected because it would leave legacy code and create confusion about which function to use

## 4. Dependencies

- **DEP-001**: Backend `createexpensesubcategory` endpoint must be functional and accessible at `/createexpensesubcategory`
- **DEP-002**: Backend endpoint must accept `CreateExpenseSubCategoryInput` with `userId`, `accountId`, `categoryId`, and `name` fields
- **DEP-003**: Backend endpoint must return response structure with `expenseSubCategory` field containing the created subcategory
- **DEP-004**: Frontend store must provide valid `userId` and `accountId` via `getStore().getAccountDetails()`
- **DEP-005**: Existing `post` utility function in `/packages/frontend/src/gateway/post.ts` must be available
- **DEP-006**: Existing `ExpenseSubCategory` type in frontend must be compatible or updated to match backend response

## 5. Files

- **FILE-001**: `/contracts/expenseSubCategory/createExpenseSubCategory.ts` - Contract definitions for API response types
- **FILE-002**: `/contracts/expenseSubCategory/models.ts` - Contract model definitions
- **FILE-003**: `/packages/frontend/src/gateway/expenseSubCategory/createExpenseSubCategory.ts` - Gateway function for API calls
- **FILE-004**: `/packages/frontend/src/gateway/mappers/expenseSubCategory/createExpenseSubCategoryResponseToDomainExpenseSubCategory.ts` - Response mapper
- **FILE-005**: `/packages/frontend/src/service/categories/addNewSubcategory.ts` - Updated service function (renamed from addNewSubcategories.ts)

## 6. Testing

- **TEST-001**: Unit tests for contract type validation
- **TEST-002**: Unit tests for gateway function with mock API responses
- **TEST-003**: Unit tests for mapper function transforming backend to frontend types
- **TEST-004**: Unit tests for updated service function with API integration
- **TEST-005**: Unit tests for error handling scenarios (network failures, validation errors)
- **TEST-006**: Integration tests verifying end-to-end API flow

## 7. Risks & Assumptions

- **RISK-001**: Backend API may not be fully implemented or may have different request/response structure than expected
- **RISK-002**: Frontend store may not provide required userId and accountId fields
- **RISK-003**: Type mismatches between frontend and backend ExpenseSubCategory interfaces
- **ASSUMPTION-001**: The backend createexpensesubcategory endpoint follows the same patterns as other endpoints in the system
- **ASSUMPTION-002**: The frontend store provides getAccountDetails() method returning userId and accountId

## 8. Related Specifications / Further Reading

- Reference implementation: `/packages/frontend/src/gateway/expenseCategory/createExpenseCategory.ts`
- Backend handler: `/packages/backend/src/expenseSubCategories/handler/createExpenseSubCategoryHandler.ts`
- Existing plan: `feature-connect-expense-category-api-1.md`
