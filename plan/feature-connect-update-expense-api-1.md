---
goal: Connect Update Expense Service to Backend API
version: 1.0
date_created: 2025-09-24
last_updated: 2025-09-24
owner: nikitasheremet
status: Completed
tags: feature, api, expenses, frontend, backend, update
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-green)

This plan outlines the implementation to update the updateExpense service function to use a new gateway function that connects to the backend API to update expenses in the database. The service will take an Expense object, map it to the required request format, call the gateway, and return the updated Expense object.

## 1. Requirements & Constraints

- **REQ-001**: Update updateExpense service to call new gateway function instead of local repository
- **REQ-002**: Service takes Expense object and returns updated Expense object
- **REQ-003**: Create updateExpense gateway function in packages/frontend/src/gateway/expense/updateExpense.ts
- **REQ-004**: Gateway makes PUT request to /updateexpense endpoint
- **REQ-005**: Define UpdateExpenseResponse contract in contracts/expense/updateExpense.ts
- **REQ-006**: Create updateExpenseResponseToDomainExpense mapper
- **REQ-007**: Map Expense object to request format (extract categoryId, subCategoryId)
- **REQ-008**: Add unit tests for all new/updated files
- **CON-001**: Follow existing project structure and naming conventions
- **CON-002**: Use TypeScript for type safety
- **GUD-001**: Write clean, maintainable code with appropriate comments
- **GUD-002**: Follow DRY principle and established coding guidelines

## 2. Implementation Steps

### Implementation Phase 1: Create Contract and Mapper

- GOAL-001: Define the API contract and response mapping

| Task     | Description                                                                 | Completed | Date       |
| -------- | --------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Create UpdateExpenseResponse contract in contracts/expense/updateExpense.ts | ✅        | 2025-09-24 |
| TASK-002 | Create updateExpenseResponseToDomainExpense mapper                          | ✅        | 2025-09-24 |
| TASK-003 | Create unit tests for updateExpense mapper                                  | ✅        | 2025-09-24 |

### Implementation Phase 2: Create Gateway Function

- GOAL-002: Implement the gateway function to handle API communication

| Task     | Description                                                        | Completed | Date       |
| -------- | ------------------------------------------------------------------ | --------- | ---------- |
| TASK-004 | Create updateExpense.ts gateway function                           | ✅        | 2025-09-24 |
| TASK-005 | Define UpdateExpenseRequest interface                              | ✅        | 2025-09-24 |
| TASK-006 | Implement PUT request to /updateexpense with proper error handling | ✅        | 2025-09-24 |
| TASK-007 | Create unit tests for updateExpense gateway                        | ✅        | 2025-09-24 |

### Implementation Phase 3: Update Service Logic

- GOAL-003: Update the service to use the new gateway

| Task     | Description                                               | Completed | Date       |
| -------- | --------------------------------------------------------- | --------- | ---------- |
| TASK-008 | Update updateExpense service to call gateway function     | ✅        | 2025-09-24 |
| TASK-009 | Add logic to map Expense object to gateway request format | ✅        | 2025-09-24 |
| TASK-010 | Update unit tests for updateExpense service               | ✅        | 2025-09-24 |

## 3. Alternatives

- **ALT-001**: Pass individual fields to service instead of full Expense object - rejected to maintain consistency with existing service interface
- **ALT-002**: Embed mapping logic directly in gateway - rejected to keep separation of concerns
- **ALT-003**: Use PATCH instead of PUT - rejected as backend uses PUT for updates

## 4. Dependencies

- **DEP-001**: Existing backend /updateexpense PUT endpoint
- **DEP-002**: Existing Expense domain type in packages/frontend/src/types/expenseData.ts
- **DEP-003**: Existing gateway utilities (put function)
- **DEP-004**: Existing mapper utilities (apiExpenseToDomain)

## 5. Files

- **FILE-001**: contracts/expense/updateExpense.ts (new)
- **FILE-002**: packages/frontend/src/gateway/expense/updateExpense.ts (new)
- **FILE-003**: packages/frontend/src/gateway/mappers/expense/updateExpenseResponseToDomainExpense.ts (new)
- **FILE-004**: packages/frontend/src/gateway/mappers/expense/**tests**/updateExpenseResponseToDomainExpense.test.ts (new)
- **FILE-005**: packages/frontend/src/gateway/expense/**tests**/updateExpense.test.ts (new)
- **FILE-006**: packages/frontend/src/service/expenses/updateExpense.ts (update)
- **FILE-007**: packages/frontend/src/service/expenses/**tests**/updateExpense.test.ts (update)

## 6. Testing

- **TEST-001**: Unit tests for updateExpenseResponseToDomainExpense mapper
- **TEST-002**: Unit tests for updateExpense gateway function covering success and error cases
- **TEST-003**: Unit tests for updateExpense service function covering mapping and gateway calls
- **TEST-004**: Mock API responses for gateway tests
- **TEST-005**: Mock gateway responses for service tests

## 7. Risks & Assumptions

- **RISK-001**: Backend API request format may change - mitigated by defining request interface
- **RISK-002**: Expense object structure may not match expected request fields - mitigated by proper mapping
- **ASSUMPTION-001**: Expense.category.id and Expense.subCategory?.id exist and are valid
- **ASSUMPTION-002**: Backend endpoint is stable and functional

## 8. Related Specifications / Further Reading

- Backend updateExpenseHandler implementation
- Existing createExpense gateway and mapper implementations
- Frontend Expense type definitions
- Backend UpdateExpenseInput validation schema
