---
goal: Update deleteCategory service| TASK-001 | Create deleteExpenseSubCategory.ts in contracts/expenseSubCategory/ with request and response interfaces | true      | 2025-09-24 |
| TASK-002 | Update models.ts in contracts/expenseSubCategory/ if needed for delete response                          | true      | 2025-09-24 |o support deleting expense subcategories
version: 1
date_created: 2025-09-24
last_updated: 2025-09-24
owner: nikitasheremet
status: Completed
tags: feature, backend, frontend, gateway, service, subcategory
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This plan outlines the implementation to update the `deleteSubcategory.ts` service to communicate with a new gateway function for deleting expense subcategories. The service will be extended to handle subcategory deletion requests, calling a new `deleteExpenseSubcategory` gateway function that interacts with the backend API.

## 1. Requirements & Constraints

- **REQ-001**: The service function must accept a subcategory ID parameter for deletion
- **REQ-002**: Implement a new gateway function `deleteExpenseSubcategory` in the expenseSubCategory gateway folder
- **REQ-003**: The gateway function must send a POST request to the 'deleteexpensesubcategory' endpoint as defined in server.ts
- **REQ-004**: Define response type in expenseSubCategory contracts folder
- **REQ-005**: Use mapper to convert response to domain ExpenseSubCategory type from expenseData.ts
- **REQ-006**: Follow the pattern established in createExpenseSubCategory.ts
- **REQ-007**: Add unit tests for all new and updated files using Vitest for frontend and Jest for backend
- **CON-001**: Must use TypeScript for type safety
- **CON-002**: Follow existing naming conventions (camelCase, etc.)
- **GUD-001**: Use named exports only, no default exports
- **GUD-002**: Include appropriate error handling and logging
- **PAT-001**: Follow the gateway/service pattern used in the project

## 2. Implementation Steps

### Implementation Phase 1: Create Contract Types

- GOAL-001: Define the request and response types for deleting expense subcategories in the contracts folder

| Task     | Description                                                                                              | Completed | Date |
| -------- | -------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-001 | Create deleteExpenseSubCategory.ts in contracts/expenseSubCategory/ with request and response interfaces |           |      |
| TASK-002 | Update models.ts in contracts/expenseSubCategory/ if needed for delete response                          |           |      |

### Implementation Phase 2: Implement Gateway Function

- GOAL-002: Create the deleteExpenseSubcategory gateway function following the createExpenseSubCategory.ts pattern

| Task     | Description                                                                                     | Completed | Date       |
| -------- | ----------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-003 | Create deleteExpenseSubCategory.ts in packages/frontend/src/gateway/expenseSubCategory/         | true      | 2025-09-24 |
| TASK-004 | Implement the deleteExpenseSubcategory function with POST request to 'deleteexpensesubcategory' | true      | 2025-09-24 |
| TASK-005 | Add mapper function to convert response to domain ExpenseSubCategory                            | true      | 2025-09-24 |
| TASK-006 | Create unit tests for the new gateway function using Vitest                                     | true      | 2025-09-24 |

### Implementation Phase 3: Update Service Function

- GOAL-003: Extend the deleteSubcategory.ts service to handle subcategory deletion

| Task     | Description                                                            | Completed | Date       |
| -------- | ---------------------------------------------------------------------- | --------- | ---------- |
| TASK-007 | Add deleteSubcategory function to deleteSubcategory.ts service         | true      | 2025-09-24 |
| TASK-008 | Update the function to call the new deleteExpenseSubcategory gateway   | true      | 2025-09-24 |
| TASK-009 | Ensure proper error handling and return the deleted ExpenseSubCategory | true      | 2025-09-24 |
| TASK-010 | Create unit tests for the updated service function using Vitest        | true      | 2025-09-24 |

## 3. Alternatives

- **ALT-001**: Create a separate service file for subcategory operations instead of extending deleteCategory.ts - rejected because the user specifically requested updating the existing service
- **ALT-002**: Use a different HTTP method for delete (e.g., DELETE instead of POST) - rejected to maintain consistency with existing backend endpoint which uses POST

## 4. Dependencies

- **DEP-001**: Existing backend endpoint '/deleteexpensesubcategory' in server.ts
- **DEP-002**: ExpenseSubCategory type from expenseData.ts
- **DEP-003**: Post utility function from gateway/post
- **DEP-004**: Store access for userId and accountId

## 5. Files

- **FILE-001**: contracts/expenseSubCategory/deleteExpenseSubCategory.ts (new)
- **FILE-002**: contracts/expenseSubCategory/models.ts (update)
- **FILE-003**: packages/frontend/src/gateway/expenseSubCategory/deleteExpenseSubCategory.ts (new)
- **FILE-004**: packages/frontend/src/gateway/mappers/expenseSubCategory/deleteExpenseSubCategoryResponseToDomainExpenseSubCategory.ts (new)
- **FILE-005**: packages/frontend/src/service/categories/deleteCategory.ts (update)
- **FILE-007**: packages/frontend/src/service/categories/**tests**/deleteCategory.test.ts (update)
- **FILE-008**: packages/frontend/src/service/categories/deleteSubcategory.ts (update)
- **FILE-009**: packages/frontend/src/service/categories/**tests**/deleteSubcategory.test.ts (new)

## 6. Testing

- **TEST-001**: Unit test for deleteExpenseSubcategory gateway function - success case
- **TEST-002**: Unit test for deleteExpenseSubcategory gateway function - error handling
- **TEST-003**: Unit test for mapper function converting response to domain type
- **TEST-004**: Unit test for deleteSubCategory service function - success case
- **TEST-005**: Unit test for deleteSubCategory service function - error handling
- **TEST-006**: Integration test to verify end-to-end subcategory deletion flow

## 7. Risks & Assumptions

- **RISK-001**: Backend endpoint may not handle the request format correctly - mitigated by following existing patterns
- **ASSUMPTION-001**: The backend deleteExpenseSubCategoryHandler returns the deleted subcategory in the response
- **ASSUMPTION-002**: User has necessary permissions to delete subcategories

## 8. Related Specifications / Further Reading

- createExpenseSubCategory.ts implementation
- Existing deleteCategory.ts service
- Backend server.ts endpoint definitions
- ExpenseSubCategory type definitions in expenseData.ts
