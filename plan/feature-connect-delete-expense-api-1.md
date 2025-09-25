---
goal: Update deleteExpense service to use backend API for deletion
| | TASK-007 | Update unit test for `deleteExpense.ts` service function to expect `Expense` return type | ✅        | 2025-09-25 |ASK-005 | Add unit test for `deleteExpenseResponseToDomainExpense.ts` in `__tests__/`              | ✅        | 2025-09-25 |ersion: 1.0
date_created: 2025-09-25
last_updated: 2025-09-25
owner: nikitasheremet
status: Completed
tags: feature, backend-api, expense-deletion
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This plan outlines the steps to update the deleteExpense service function to interact with the backend API instead of the repository. The service will now call a new gateway function that performs a POST request to the `/deleteexpense` endpoint, returning the deleted Expense object. New contract definitions, mappers, and unit tests will be created to support this functionality.

## 1. Requirements & Constraints

- **REQ-001**: Update `deleteExpense` service function to return `Expense` object instead of `string`
- **REQ-002**: Create new gateway function `deleteExpense` in `packages/frontend/src/gateway/expense/deleteExpense.ts`
- **REQ-003**: Gateway function must perform POST request to `/deleteexpense` endpoint
- **REQ-004**: Define `DeleteExpenseRequest` and `DeleteExpenseResponse` types in `contracts/expense/deleteExpense.ts`
- **REQ-005**: Create mapper `deleteExpenseResponseToDomainExpense` in `packages/frontend/src/gateway/mappers/expense/`
- **REQ-006**: Add unit tests for all new and updated files
- **CON-001**: Follow existing naming conventions (camelCase, subCategory capitalized C)
- **CON-002**: Use TypeScript for all new code
- **CON-003**: Follow DRY principle and existing code patterns
- **GUD-001**: Use early returns for error handling
- **GUD-002**: Log errors with contextual information in async operations
- **PAT-001**: Follow structure from `createExpense.ts` gateway function

## 2. Implementation Steps

### Implementation Phase 1: Define Contracts and Types

- GOAL-001: Create contract definitions for delete expense API

| Task     | Description                                                                                                                                                                    | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---------- |
| TASK-001 | Create `contracts/expense/deleteExpense.ts` with `DeleteExpenseRequest` (containing `expenseId: string`) and `DeleteExpenseResponse` (containing `deletedExpense: ApiExpense`) | ✅        | 2025-09-25 |

### Implementation Phase 2: Create Gateway Function

- GOAL-002: Implement gateway function for deleting expenses

| Task     | Description                                                                                                                                                                                  | Completed | Date       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-002 | Create `packages/frontend/src/gateway/expense/deleteExpense.ts` with `deleteExpense` function that takes `expenseId: string`, performs POST to 'deleteexpense', and returns mapped `Expense` | ✅        | 2025-09-25 |

### Implementation Phase 3: Create Mapper

- GOAL-003: Implement response mapper for delete expense

| Task     | Description                                                                                                    | Completed | Date       |
| -------- | -------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-003 | Create `packages/frontend/src/gateway/mappers/expense/deleteExpenseResponseToDomainExpense.ts` mapper function | ✅        | 2025-09-25 |

### Implementation Phase 4: Update Service Function

- GOAL-004: Modify service to use new gateway

| Task     | Description                                                                                                                        | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-004 | Update `packages/frontend/src/service/expenses/deleteExpense.ts` to call gateway function and return `Expense` instead of `string` | ✅        | 2025-09-25 |

### Implementation Phase 5: Add Unit Tests

- GOAL-005: Create comprehensive unit tests

| Task     | Description                                                                              | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-005 | Add unit test for `deleteExpenseResponseToDomainExpense.ts` in `__tests__/`              |           |            |
| TASK-006 | Add unit test for `deleteExpense.ts` gateway function in `__tests__/`                    | ✅        | 2025-09-25 |
| TASK-007 | Update unit test for `deleteExpense.ts` service function to expect `Expense` return type |           |            |

## 3. Alternatives

- **ALT-001**: Use PUT instead of POST for delete endpoint - Rejected because server.ts uses POST for deleteexpense
- **ALT-002**: Return void from service instead of deleted Expense - Rejected because requirements specify returning deleted Expense object
- **ALT-003**: Reuse existing repository function - Rejected because goal is to connect to backend API

## 4. Dependencies

- **DEP-001**: Backend `/deleteexpense` endpoint must accept POST request with expenseId and return deleted expense data
- **DEP-002**: Existing `Expense` and `ApiExpense` types from `@/types/expenseData` and contracts
- **DEP-003**: `post` utility from `@gateway/post`
- **DEP-004**: Existing mapper patterns in `gateway/mappers/expense/`

## 5. Files

- **FILE-001**: `contracts/expense/deleteExpense.ts` - New contract definitions
- **FILE-002**: `packages/frontend/src/gateway/expense/deleteExpense.ts` - New gateway function
- **FILE-003**: `packages/frontend/src/gateway/mappers/expense/deleteExpenseResponseToDomainExpense.ts` - New mapper
- **FILE-004**: `packages/frontend/src/service/expenses/deleteExpense.ts` - Updated service function
- **FILE-005**: `packages/frontend/src/gateway/mappers/expense/__tests__/deleteExpenseResponseToDomainExpense.test.ts` - New mapper test
- **FILE-006**: `packages/frontend/src/gateway/expense/__tests__/deleteExpense.test.ts` - New gateway test
- **FILE-007**: `packages/frontend/src/service/expenses/__tests__/deleteExpense.test.ts` - Updated service test (assuming it exists)

## 6. Testing

- **TEST-001**: Unit test for `deleteExpenseResponseToDomainExpense` mapper - verify correct transformation from API response to domain Expense
- **TEST-002**: Unit test for `deleteExpense` gateway function - mock POST request and verify correct parameters and response mapping
- **TEST-003**: Unit test for updated `deleteExpense` service function - verify it calls gateway and returns Expense object

## 7. Risks & Assumptions

- **RISK-001**: Backend `/deleteexpense` endpoint may not return the expected response structure - Mitigation: Verify backend handler implementation
- **ASSUMPTION-001**: `DeleteExpenseRequest` only requires `expenseId` field based on similar update/create patterns
- **ASSUMPTION-002**: `ApiExpense` type exists and matches backend response structure

## 8. Related Specifications / Further Reading

- Reference `createExpense.ts` gateway implementation for pattern consistency
- Backend handler in `packages/backend/src/expense/handler/deleteExpenseHandler.ts`
- Existing contract patterns in `contracts/expense/`
