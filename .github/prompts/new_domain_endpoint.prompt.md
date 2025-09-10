# New Domain Endpoint Creation Prompt Template

Use this template to create a new endpoint in a new domain. Replace the placeholders with your specific values.

## Template Usage

Create a new endpoint: **[ENDPOINT_NAME]**. This will be the first endpoint in the new domain **[DOMAIN_NAME]**. Because this is a new domain you will need to create the necessary file structure that should mirror existing domains (like `expense` and `expenseCategories`) for the handler, validation, service, and repository directories and subdirectories.

## Input Specification

The endpoint should receive the following input:

- **[FIELD_1]** - [TYPE] - [REQUIRED/OPTIONAL] - [ADDITIONAL_CONSTRAINTS]
- **[FIELD_2]** - [TYPE] - [REQUIRED/OPTIONAL] - [ADDITIONAL_CONSTRAINTS]
- **[FIELD_N]** - [TYPE] - [REQUIRED/OPTIONAL] - [ADDITIONAL_CONSTRAINTS]

## Architecture Overview

The handler should receive the input, call validation to validate it, then call service to create the **[ENTITY_NAME]**. The service function should call the repository to create the **[ENTITY_NAME]** in the database. The handler should be registered in `server.ts`.

## Layer-by-Layer Implementation Details

### Handler Layer

- Should call validation function which will assert the input type
- Then call the service function which will handle the business logic of creating the **[ENTITY_NAME]**
- If there is a failure, the handler will catch it, assign a status code using `errorStatusMapper.ts`, and add an error property to the response body with the error message
- Must have unit tests for:
  - When validation throws an error
  - When service throws an error
  - When everything succeeds
- Use `createExpenseHandler.ts` as the example for handler logic
- Use `createExpenseHandler.test.ts` as the example for unit tests

### Validation Layer

- The validation function will call `parse` on the zod input schema
- Wrap any errors in `validationError.ts` and return the error message
- Use `createExpenseValidation.ts` as an example
- The **[CREATE_ENTITY_INPUT_SCHEMA_NAME]** should live in a models file within the validation directory
- Use `models.ts` as an example for schema structure
- Put schema fragments under `validationUtil` within the validation directory
- Must have unit tests for each field in the input testing every possible failure condition
- Use `createExpenseValidation.test.ts` as an example

### Service Layer

- The service function will call the repository function and return the response
- It will be a promise
- Needs unit tests for:
  - Failure of repository call
  - Success of repository call

### Repository Layer

- The repository function will call `insert` via drizzle to create the **[ENTITY_NAME]**
- Will then call the **[ENTITY_NAME]** mapper under `mappers` to convert the database response to the domain **[ENTITY_TYPE]** and return it
- Unit tests should test:
  - If insert returns an error
  - If **[ENTITY_NAME]** is inserted correctly, that it returns the converted object

### End-to-End Testing

- After all layers and unit tests are complete, add e2e Playwright tests in the `e2e` directory
- Use `createExpense.spec.ts` as an example
- Follow all established coding practices

## File Structure Requirements

Create the following directory structure mirroring existing domains:

```
src/
├── handlers/[DOMAIN_NAME]/
├── validation/[DOMAIN_NAME]/
├── services/[DOMAIN_NAME]/
├── repositories/[DOMAIN_NAME]/
└── mappers/[DOMAIN_NAME]/
```

## Coding Standards Compliance

- Follow TypeScript best practices
- Use named exports only (no default exports)
- Implement proper error handling with try/catch blocks
- Use descriptive variable and function names
- Follow camelCase naming convention
- Write comprehensive unit tests using Jest
- Structure tests with `describe` and `it` blocks
- Use "fake" prefix for test variables and "mock" prefix for mocked functions
- Ensure all code is properly typed with TypeScript

## Example Usage

**Endpoint Name**: createExpenseSubcategories  
**Domain Name**: expenseSubCategories  
**Entity Name**: subcategory  
**Entity Type**: ExpenseSubCategory  
**Input Fields**:

- userId - uuid - required
- accountId - uuid - required
- categoryId - uuid - required
- name - string - required - nonempty
