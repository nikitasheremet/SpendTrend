---
goal: Implement updateIncome service and gateway functions for updating income records
version: 1
date_created: 2025-10-01
last_updated: 2025-10-01
owner: nikitasheremet
status: Planned
tags: feature
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan outlines the implementation of an `updateIncome` service function and corresponding gateway function to enable updating income records in the SpendTrend application. The service will accept a full Income object and return an updated Income object, following established patterns in the codebase.

## 1. Requirements & Constraints

- **REQ-001**: Service function must accept a full Income object and return an Income object
- **REQ-002**: Gateway function must make a PUT request to the backend
- **REQ-003**: Gateway must require userId, accountId, id, name, amount, date fields based on deleteIncome pattern
- **REQ-004**: Response must be defined in contracts and use existing apiIncomeToDomain mapper
- **REQ-005**: Unit tests must be written for both service and gateway functions
- **CON-001**: No new mappers should be created; reuse existing apiIncomeToDomain
- **GUD-001**: Follow existing coding conventions and patterns from deleteIncome and other income functions
- **PAT-001**: Use established error handling with try/catch and logging

## 2. Implementation Steps

                                                   |           |      |

### Implementation Phase 2: Frontend Gateway

- GOAL-002: Implement frontend gateway function for updateIncome

| Task     | Description                                                                                                                                | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-008 | Create packages/frontend/src/gateway/income/updateIncome.ts with UpdateIncomeRequest interface and updateIncome function using put request |           |      |
| TASK-009 | Create unit tests for updateIncome gateway in packages/frontend/src/gateway/income/**tests**/updateIncome.test.ts                          |           |      |

### Implementation Phase 3: Frontend Service

- GOAL-003: Implement frontend service function for updateIncome

| Task     | Description                                                                                                                          | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-010 | Implement updateIncome function in packages/frontend/src/service/income/updateIncome.ts accepting Income object and returning Income |           |      |
| TASK-011 | Create unit tests for updateIncome service in packages/frontend/src/service/income/**tests**/updateIncome.test.ts                    |           |      |

## 3. Alternatives

- **ALT-001**: Partial update instead of full Income object - rejected because requirements specify full Income object
- **ALT-002**: Create new mapper - rejected because requirements specify reuse existing mappers

## 4. Dependencies

- **DEP-001**: Existing apiIncomeToDomain mapper in packages/frontend/src/gateway/mappers/income/
- **DEP-002**: Existing put utility in packages/frontend/src/gateway/put.ts
- **DEP-003**: Existing store for userId and accountId retrieval
- **DEP-004**: Existing Income type from packages/frontend/src/types/income/income.ts

## 5. Files

- **FILE-001**: contracts/income/updateIncome.ts (new)
- **FILE-002**: packages/backend/src/income/validation/models.ts (modify)
- **FILE-003**: packages/backend/src/income/validation/updateIncomeValidation.ts (new)
- **FILE-004**: packages/backend/src/income/service/updateIncomeService.ts (new)
- **FILE-005**: packages/backend/src/income/repository/updateIncomeRepository.ts (new)
- **FILE-006**: packages/backend/src/income/handler/updateIncomeHandler.ts (new)
- **FILE-007**: packages/backend/src/server.ts (modify)
- **FILE-008**: packages/frontend/src/gateway/income/updateIncome.ts (new)
- **FILE-009**: packages/frontend/src/gateway/income/**tests**/updateIncome.test.ts (new)
- **FILE-010**: packages/frontend/src/service/income/updateIncome.ts (modify)
- **FILE-011**: packages/frontend/src/service/income/**tests**/updateIncome.test.ts (new)

## 6. Testing

- **TEST-001**: Unit tests for updateIncome gateway function covering success and error cases
- **TEST-002**: Unit tests for updateIncome service function covering success and error cases
- **TEST-003**: Backend validation tests for updateIncome input
- **TEST-004**: Backend handler tests for updateIncome endpoint

## 7. Risks & Assumptions

- **RISK-001**: Backend database update logic may require additional validation not covered in this plan
- **ASSUMPTION-001**: Existing put utility and mapper functions work as expected for update operations
- **ASSUMPTION-002**: Income object passed to service contains all required fields for update

## 8. Related Specifications / Further Reading

- feature-implement-delete-income-service-1.md
- feature-create-income-service-1.md
