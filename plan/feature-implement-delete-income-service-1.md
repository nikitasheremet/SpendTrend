---
goal: Implement deleteIncome service function and related components
version: 1
date_created: 2025-10-01
last_updated: 2025-10-01
owner: nikitasheremet
status: 'Completed'
tags: ['feature', 'backend', 'frontend', 'service', 'gateway', 'contract']
---

# Introduction

![Status: In Progress](https://img.shields.io/badge/status-In%20Progress-yellow)

This plan outlines the implementation of a deleteIncome service function that allows deleting an income entry by ID. The service will interact with the backend via a new gateway function, handle the response through a mapper, and return the deleted Income domain object.

## 1. Requirements & Constraints

- **REQ-001**: Service function must accept income ID as parameter
- **REQ-002**: Service must retrieve userId and accountId from store
- **REQ-003**: Gateway must make POST request to /deleteincome endpoint
- **REQ-004**: Response must be mapped to domain Income object
- **REQ-005**: Follow existing patterns from createIncome and getAllIncomes
- **CON-001**: Must use existing post utility function
- **CON-002**: Must follow TypeScript naming conventions
- **GUD-001**: Use named exports only
- **GUD-002**: Include proper error handling with try/catch
- **PAT-001**: Follow service-gateway-contract-mapper pattern

## 2. Implementation Steps

### Implementation Phase 1: Define Contract Types

- GOAL-001: Create contract types for deleteIncome response

| Task     | Description                                                                                                | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Create contracts/income/deleteIncome.ts with DeleteIncomeResponse interface containing deletedIncome field | Yes       | 2025-10-01 |

### Implementation Phase 2: Implement Gateway Function

- GOAL-002: Create deleteIncome gateway function

| Task     | Description                                                                                        | Completed | Date       |
| -------- | -------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-002 | Create gateway/income/deleteIncome.ts with DeleteIncomeRequest interface extending required fields | Yes       | 2025-10-01 |
| TASK-003 | Implement deleteIncome function that calls post<DeleteIncomeResponse>('deleteincome', request)     | Yes       | 2025-10-01 |

### Implementation Phase 3: Create Response Mapper

- GOAL-003: Implement mapper for deleteIncome response

| Task     | Description                                                                                            | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------ | --------- | ---------- |
| TASK-004 | Create mappers/income/apiDeletedIncomeToDomain.ts function that converts API response to domain Income | Yes       | 2025-10-01 |

### Implementation Phase 4: Implement Service Function

- GOAL-004: Create deleteIncome service function

| Task     | Description                                                                              | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-005 | Implement deleteIncome in service/income/deleteIncome.ts following getAllIncomes pattern | Yes       | 2025-10-01 |
| TASK-006 | Add proper error handling with try/catch and logging                                     | Yes       | 2025-10-01 |

## 3. Alternatives

- **ALT-001**: Use DELETE HTTP method instead of POST - Rejected because backend uses POST for deleteincome endpoint
- **ALT-002**: Return void instead of deleted Income - Rejected to maintain consistency with createIncome pattern

## 4. Dependencies

- **DEP-001**: Existing getStore().getAccountDetails() function
- **DEP-002**: Existing post utility function from @gateway/post
- **DEP-003**: Existing Income domain type from @/types/income/income
- **DEP-004**: Existing apiIncomeToDomain mapper pattern

## 5. Files

- **FILE-001**: contracts/income/deleteIncome.ts - New contract type definition
- **FILE-002**: packages/frontend/src/gateway/income/deleteIncome.ts - New gateway function
- **FILE-003**: packages/frontend/src/gateway/mappers/income/apiDeletedIncomeToDomain.ts - New mapper function
- **FILE-004**: packages/frontend/src/service/income/deleteIncome.ts - Service function implementation

## 6. Testing

- **TEST-001**: Unit test for deleteIncome service function
- **TEST-002**: Unit test for deleteIncome gateway function
- **TEST-003**: Unit test for apiDeletedIncomeToDomain mapper

## 7. Risks & Assumptions

- **RISK-001**: Backend deleteincome endpoint may not exist or have different signature - Assumption is that it matches the pattern of other endpoints
- **ASSUMPTION-001**: getStore().getAccountDetails() returns userId and accountId
- **ASSUMPTION-002**: post utility handles errors appropriately

## 8. Related Specifications / Further Reading

- Reference: packages/frontend/src/gateway/income/createIncome.ts
- Reference: packages/frontend/src/service/income/getAllIncomes.ts
- Backend endpoint: packages/backend/src/server.ts route /deleteincome
