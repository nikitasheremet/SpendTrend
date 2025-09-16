```markdown
# Existing Domain Endpoint Creation Prompt Template

Use this template to create a new endpoint within an existing domain. Replace placeholders with your specific values. This template assumes the domain folder and its top-level directories (handler, validation, service, repository, mappers) already exist.

## Template Usage

Create a new endpoint: **[ENDPOINT_NAME]** inside an existing domain **[DOMAIN_NAME]**. The endpoint will add a handler, validation, service, repository within the existing domain's directories.

## Input Specification

- **[FIELD_1]** - [TYPE] - [REQUIRED/OPTIONAL] - [ADDITIONAL_CONSTRAINTS]
- **[FIELD_2]** - [TYPE] - [REQUIRED/OPTIONAL] - [ADDITIONAL_CONSTRAINTS]
- **[FIELD_N]** - [TYPE] - [REQUIRED/OPTIONAL] - [ADDITIONAL_CONSTRAINTS]

## Architecture Overview

The handler should receive the input, call validation to validate it, then call the service to perform business logic. The service should call the repository to interact with the database. The handler must be registered in `server.ts`

## Layer-by-Layer Implementation Details

### Handler Layer

- Call the validation function which asserts input types.
- Call the service function which implements business logic and returns the domain entity or an error.
- Catch failures, set a status code using `errorStatusMapper.ts`, and include an `error` property on the response body.
- Unit tests (Jest):
  - when validation throws an error - it should return non success error code and contain an error message
  - when service throws an error - it should return non success error code and contain an error message
  - when everything succeeds - it should return the appropriate object based on what this endpoint it doing
  - Use existing `createExpenseHandler.ts` and its tests as examples.
  - Only mock the validation and service functions. Don't mock the error status mapper.

### Validation Layer

- Validation function should `assert` the input type
- Use zod schemas and call `parse` to validate input.
- Wrap validation failures in `validationError.ts` and return meaningful messages.
- Place the input schema name in a `models` file inside the validation directory; use `validationUtil` for schema fragments.
- Unit tests: test each input field for all failure conditions. Use existing `createExpenseValidation.test.ts` as example.

### Service Layer

- Implement as a Promise-returning function.
- Call the repository and translate or enrich repository results as needed.
- Unit tests: repository failure and repository success cases.

### Repository Layer

- Use `drizzle` (or the project's DB layer) to `insert`/`update`/`select` as required.
- Convert DB results to domain entities using the domain `mappers` and return them.
- Unit tests: handle insert/select error scenarios and success mapping.

### Mappers

- Place mappers under the `utilities/mappers` directory. Map database rows to domain types.

## End-to-End Testing

- After unit tests are in place, add Playwright e2e tests under the domain `e2e` directory (use existing `createExpense.spec.ts` as an example).

## File Structure Requirements (existing domain)
```

src/
├── [DOMAIN_NAME]/
│ ├── **tests**/
│ │ ├── handler/
│ │ ├── repository/
│ │ ├── service/
│ │ └── validation/
│ ├── handler/
│ │ ├── [specificFunction].ts
│ │ └── index.ts
│ ├── service/
│ │ ├── [specificFunction].ts
│ │ └── index.ts
│ ├── repository/
│ │ ├── [specificFunction].ts
│ │ └── index.ts
│ └── validation/
│ ├── validationUtils/
│ │ └── [schemaFragments].ts
│ ├── [validationFunction].ts
│ ├── index.ts
│ ├── models.ts
│

```

## Coding Standards Compliance

- TypeScript only for new code and named exports only (no default exports).
- Use camelCase for identifiers and ALL_CAPS for constants.
- No magic numbers or magic text.
- Use try/catch for async operations and log errors with context.
- Follow project testing conventions: Jest `describe`/`it` structure, `fake` prefix for fake variables, `mock` prefix for mocked functions.

## Contract

- Inputs: validated object matching the zod schema.
- Outputs: domain entity or structured error object { error: string } with appropriate HTTP status.
- Error modes: validation error, service/repository error, unexpected exception.

## Edge Cases to Consider

- Missing or null inputs
- Invalid UUIDs or IDs not found
- DB constraint violations or unique key conflicts
- Slow DB responses/timeouts

## Example Usage

**Endpoint Name**: createExpenseSubcategory
**Domain Name**: expenseSubCategories
**Entity Name**: subcategory
**Entity Type**: ExpenseSubCategory
**Input Fields**:

- userId - uuid - required
- accountId - uuid - required
- categoryId - uuid - optional
- name - string - required - nonempty

---

Keep prompts concise when passing to engineers: include the endpoint name, domain, entity, and the input schema. Reference existing handler/service/repository examples in the repo to match style and error handling.
```
