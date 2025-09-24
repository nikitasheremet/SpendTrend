---
goal: Connect Get Expenses API to Frontend Service
version: 1.0
date_created: 2025-09-24
last_updated: 2025-09-24
owner: nikitasheremet
status: Planned
tags: feature, api, expenses, frontend, backend
---

# Introduction

![Status: Phase 1 Complete](https://img.shields.io/badge/status-Phase%201%20Complete-blue)

This plan outlines the implementation to update the getExpenses service logic in the frontend to properly fetch expenses from the backend API. The service will call a new gateway function that handles the API request and response mapping.

## 1. Requirements & Constraints

- **REQ-001**: Update getExpenses service to return Expense[] type without accepting request parameters
- **REQ-002**: Create new gateway function in packages/frontend/src/gateway/expense/getExpenses.ts
- **REQ-003**: Gateway function must accept request with userId and accountId fields
- **REQ-004**: Gateway function must return response matching backend API format
- **REQ-005**: Map backend response to frontend Expense domain type
- **REQ-006**: Add unit tests for all new/updated files
- **CON-001**: Follow existing project structure and naming conventions
- **CON-002**: Use TypeScript for type safety
- **GUD-001**: Write clean, maintainable code with appropriate comments
- **GUD-002**: Follow DRY principle and established coding guidelines

## 2. Implementation Steps

### Implementation Phase 1: Create Gateway Function

- GOAL-001: Implement the gateway function to handle API communication with the backend

| Task     | Description                                                                                 | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Create getExpenses.ts in packages/frontend/src/gateway/expense/                             | ✅        | 2025-09-24 |
| TASK-002 | Define GetExpensesRequest interface with userId and accountId                               | ✅        | 2025-09-24 |
| TASK-003 | Define GetExpensesResponse interface matching backend response in contracts                 | ✅        | 2025-09-24 |
| TASK-004 | Implement getExpensesGateway function that makes GET request to /expenses with query params | ✅        | 2025-09-24 |
| TASK-005 | Add error handling for API failures                                                         | ✅        | 2025-09-24 |
| TASK-006 | Create unit tests for getExpenses.ts in **tests**/getExpenses.test.ts                       | ✅        | 2025-09-24 |

### Implementation Phase 2: Update Service Logic

- GOAL-002: Update the service to use the new gateway and map response to domain types

| Task     | Description                                                                           | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-007 | Update packages/frontend/src/service/expenses/getExpenses.ts to call gateway function | ✅        | 2025-09-24 |
| TASK-008 | Remove recursive call bug in getExpenses function                                     | ✅        | 2025-09-24 |
| TASK-009 | Add logic to obtain userId and accountId from frontend context/store                  | ✅        | 2025-09-24 |
| TASK-010 | Map gateway response to Expense[] domain type                                         | ✅        | 2025-09-24 |
| TASK-011 | Update unit tests for getExpenses.ts service                                          | ✅        | 2025-09-24 |

## 3. Alternatives

- **ALT-001**: Pass userId and accountId as parameters to service function - rejected because requirement specifies no request params
- **ALT-002**: Use a different HTTP client library - rejected to maintain consistency with existing gateway functions
- **ALT-003**: Embed mapping logic directly in gateway - rejected to keep separation of concerns between API and domain layers

## 4. Dependencies

- **DEP-001**: Existing backend /expenses endpoint with userId and accountId query parameters
- **DEP-002**: Frontend context/store providing userId and accountId
- **DEP-003**: Existing Expense types in packages/frontend/src/types/expenseData.ts

## 5. Files

- **FILE-001**: packages/frontend/src/gateway/expense/getExpenses.ts (new)
- **FILE-002**: packages/frontend/src/gateway/expense/**tests**/getExpenses.test.ts (new)
- **FILE-003**: packages/frontend/src/service/expenses/getExpenses.ts (update)
- **FILE-004**: packages/frontend/src/service/expenses/**tests**/getExpenses.test.ts (update)

## 6. Testing

- **TEST-001**: Unit tests for getExpensesGateway function covering success and error cases
- **TEST-002**: Unit tests for getExpenses service function covering mapping and error handling
- **TEST-003**: Mock API responses to test gateway function
- **TEST-004**: Mock gateway responses to test service function

## 7. Risks & Assumptions

- **RISK-001**: Backend API response format may change - mitigated by defining response interface
- **ASSUMPTION-001**: userId and accountId are available in frontend context/store
- **ASSUMPTION-002**: Backend endpoint is stable and functional

## 8. Related Specifications / Further Reading

- Backend getExpensesHandler implementation
- Existing gateway functions in packages/frontend/src/gateway/expense/
- Frontend Expense type definitions</content>
  <parameter name="filePath">/Users/nikita/personal-finance/plan/feature-connect-get-expenses-api-1.md
