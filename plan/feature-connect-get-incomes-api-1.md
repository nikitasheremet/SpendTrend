---
goal: Implement getAllIncomes service to fetch all incomes for an account from the backend
version: 1.0
date_created: 2025-09-30
last_updated: 2025-09-30
owner: nikitasheremet
status: 'Completed'
tags: ['feature', 'frontend', 'gateway', 'service', 'income']
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-green)

This plan outlines the implementation to update the getAllIncomes service function to fetch all incomes for a user's account from the backend API. The implementation will follow the existing patterns in the codebase for gateway functions, contracts, mappers, and services.

## 1. Requirements & Constraints

- **REQ-001**: getAllIncomes should take no parameters and return Promise<Income[]>
- **REQ-002**: Function should retrieve userId and accountId from the store using getStore().getAccountDetails()
- **REQ-003**: Create new gateway function getIncomes that calls GET /incomes endpoint with userId and accountId as query parameters
- **REQ-004**: Gateway should use contracts for response types
- **REQ-005**: Response should be mapped from contract type to domain Income type
- **REQ-006**: All new files must have unit tests following Vitest patterns
- **CON-001**: Follow existing naming conventions (camelCase, subCategory capitalized C)
- **CON-002**: Use named exports only, no default exports
- **CON-003**: Follow DRY principle and existing code patterns
- **GUD-001**: Write clean, maintainable TypeScript code with proper error handling
- **GUD-002**: Use early returns for error handling where possible

## 2. Implementation Steps

### Implementation Phase 1: Create Contract and Gateway Infrastructure

- GOAL-001: Establish the contract and gateway foundation for getIncomes API

| Task     | Description                                                                              | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Create contracts/income/getIncomes.ts with GetIncomesResponse interface                  | ✅        | 2025-09-30 |
| TASK-002 | Create packages/frontend/src/gateway/income/getIncomes.ts gateway function               | ✅        | 2025-09-30 |
| TASK-003 | Create packages/frontend/src/gateway/mappers/income/getIncomesResponseToDomain.ts mapper | ✅        | 2025-09-30 |

### Implementation Phase 2: Update Service and Add Tests

- GOAL-002: Integrate gateway into service layer and add comprehensive test coverage

| Task     | Description                                                                 | Completed | Date       |
| -------- | --------------------------------------------------------------------------- | --------- | ---------- |
| TASK-004 | Update packages/frontend/src/service/income/getAllIncomes.ts to use gateway | ✅        | 2025-09-30 |
| TASK-007 | Create unit tests for getAllIncomes service                                 | ✅        | 2025-09-30 |

## 3. Alternatives

- **ALT-001**: Instead of creating separate contract file, could extend existing models.ts - rejected because other get endpoints have separate contract files
- **ALT-002**: Could pass userId/accountId as parameters to getAllIncomes - rejected because requirements specify no params and get from store
- **ALT-003**: Could use existing apiIncomeToDomain mapper - rejected because response structure may differ (array vs single object)

## 4. Dependencies

- **DEP-001**: Backend /incomes GET endpoint (already exists)
- **DEP-002**: getStore().getAccountDetails() from store (already exists)
- **DEP-003**: @gateway/get utility function (already exists)
- **DEP-004**: Existing Income domain types (already exists)
- **DEP-005**: Existing contract Income model (already exists)

## 5. Files

- **FILE-001**: contracts/income/getIncomes.ts - New contract for get incomes response
- **FILE-002**: packages/frontend/src/gateway/income/getIncomes.ts - New gateway function
- **FILE-003**: packages/frontend/src/gateway/mappers/income/getIncomesResponseToDomain.ts - New mapper function
- **FILE-004**: packages/frontend/src/service/income/getAllIncomes.ts - Updated service function
- **FILE-005**: packages/frontend/src/gateway/income/**tests**/getIncomes.test.ts - New gateway tests
- **FILE-006**: packages/frontend/src/gateway/mappers/income/**tests**/getIncomesResponseToDomain.test.ts - New mapper tests
- **FILE-007**: packages/frontend/src/service/income/**tests**/getAllIncomes.test.ts - New service tests

## 6. Testing

- **TEST-001**: Gateway function should call correct endpoint with query params
- **TEST-002**: Gateway function should handle HTTP errors appropriately
- **TEST-003**: Mapper should correctly transform contract Income[] to domain Income[]
- **TEST-004**: Service should get account details from store
- **TEST-005**: Service should call gateway with correct parameters
- **TEST-006**: Service should return mapped domain incomes
- **TEST-007**: All functions should handle errors gracefully

## 7. Risks & Assumptions

- **RISK-001**: Backend endpoint may not be fully implemented - assuming it exists based on server.ts
- **ASSUMPTION-001**: Store getAccountDetails returns userId and accountId - based on addNewIncome.ts usage
- **ASSUMPTION-002**: Contract Income model matches backend response - based on existing patterns

## 8. Related Specifications / Further Reading

- Existing getExpenseCategories implementation for pattern reference
- Backend getIncomesHandler implementation for expected request/response format
- addNewIncome.ts for store usage pattern
