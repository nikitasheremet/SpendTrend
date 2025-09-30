---
goal: Implement createIncome service function with gateway and contract integration
version: 1.0
date_created: 2025-09-29
last_updated: 2025-09-29
owner: nikitasheremet
status: Planned
tags: feature, income, service, gateway, contract
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan outlines the implementation of a new createIncome service function in the frontend, following the established expense module pattern. The service will handle creating new income entries by attaching user and account IDs from the store, calling a new gateway function, and returning the created income object.

## 1. Requirements & Constraints

- **REQ-001**: Create createIncome service function in packages/frontend/src/service/income/createIncome.ts
- **REQ-002**: Service function must accept NewIncome object and return Promise<Income>
- **REQ-003**: Attach userId and accountId from store using getStore().getAccountDetails()
- **REQ-004**: Call new gateway function with constructed request object
- **REQ-005**: Create new gateway function in packages/frontend/src/gateway/income/createIncome.ts
- **REQ-006**: Gateway must make POST request to 'createincome' endpoint
- **REQ-007**: Gateway must return CreateIncomeResponse contract type
- **REQ-008**: Create new contract type CreateIncomeResponse in contracts/income/createIncome.ts
- **REQ-009**: Create Income contract model in contracts/income/models.ts
- **REQ-010**: Gateway must use new mapper to convert response to domain Income object
- **REQ-011**: Create mapper in packages/frontend/src/gateway/mappers/income/apiIncomeToDomain.ts
- **REQ-012**: Follow expense module structure and naming conventions
- **CON-001**: Use TypeScript for all new code
- **CON-002**: Follow established folder structure
- **CON-003**: Use named exports only
- **GUD-001**: Write clean, maintainable code with appropriate comments
- **PAT-001**: Follow same pattern as expense create functionality

## 2. Implementation Steps

### Implementation Phase 1: Create Contract Types

- GOAL-001: Establish contract types for income creation API response

| Task     | Description                                                                    | Completed | Date       |
| -------- | ------------------------------------------------------------------------------ | --------- | ---------- |
| TASK-001 | Create contracts/income/models.ts with Income interface matching backend model | x         | 2025-09-29 |
| TASK-002 | Create contracts/income/createIncome.ts with CreateIncomeResponse type         | x         | 2025-09-29 |

### Implementation Phase 2: Create Gateway Infrastructure

- GOAL-002: Implement gateway function and mapper for income creation

| Task     | Description                                                                              | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-003 | Create packages/frontend/src/gateway/mappers/income/ directory                           | x         | 2025-09-29 |
| TASK-004 | Create packages/frontend/src/gateway/mappers/income/apiIncomeToDomain.ts mapper function | x         | 2025-09-29 |
| TASK-005 | Create packages/frontend/src/gateway/income/ directory                                   | x         | 2025-09-29 |
| TASK-006 | Create packages/frontend/src/gateway/income/createIncome.ts gateway function             | x         | 2025-09-29 |

### Implementation Phase 3: Create Service Function

- GOAL-003: Implement the main createIncome service function

| Task     | Description                                                                  | Completed | Date       |
| -------- | ---------------------------------------------------------------------------- | --------- | ---------- |
| TASK-007 | Create packages/frontend/src/service/income/createIncome.ts service function | x         | 2025-09-29 |

## 3. Alternatives

- **ALT-001**: Reuse existing expense gateway infrastructure - Rejected because income has different data structure and requirements
- **ALT-002**: Create shared gateway utilities - Rejected to maintain separation of concerns and follow existing module pattern

## 4. Dependencies

- **DEP-001**: Existing store implementation with getAccountDetails() method
- **DEP-002**: Existing post utility in @gateway/post
- **DEP-003**: Backend createincome endpoint already implemented
- **DEP-004**: NewIncome and Income types already defined in frontend types

## 5. Files

- **FILE-001**: contracts/income/models.ts - New contract model for Income
- **FILE-002**: contracts/income/createIncome.ts - New contract for create response
- **FILE-003**: packages/frontend/src/gateway/mappers/income/apiIncomeToDomain.ts - New mapper function
- **FILE-004**: packages/frontend/src/gateway/income/createIncome.ts - New gateway function
- **FILE-005**: packages/frontend/src/service/income/createIncome.ts - New service function

## 6. Testing

- **TEST-001**: Unit test for createIncome service function
- **TEST-002**: Unit test for createIncome gateway function
- **TEST-003**: Unit test for apiIncomeToDomain mapper
- **TEST-004**: Integration test verifying end-to-end create income flow

## 7. Risks & Assumptions

- **RISK-001**: Backend createincome endpoint may have different response structure than expected
- **ASSUMPTION-001**: Store getAccountDetails() returns userId and accountId as strings
- **ASSUMPTION-002**: NewIncome type matches backend expectations for creation

## 8. Related Specifications / Further Reading

- Expense create implementation in packages/frontend/src/service/expenses/addNewExpense.ts
- Expense gateway in packages/frontend/src/gateway/expense/createExpense.ts
- Backend createIncomeHandler in packages/backend/src/income/handler/createIncomeHandler.ts
