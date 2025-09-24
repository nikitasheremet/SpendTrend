---
applyTo: '**'
---

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

1. **Project Context**:
   - This project is a personal finance management tool.
   - The application aims to help users track their income, expenses, and savings goals.

2. **Coding Guidelines**:
   - Follow the established folder structure and naming conventions.
   - Write clean, maintainable code with appropriate comments.
   - Use TypeScript for all new code to ensure type safety.
   - Write unit tests for all new features and bug fixes.
   - Follow the DRY (Don't Repeat Yourself) principle to avoid code duplication.
   - Use descriptive variable and function names to improve code readability.
   - Keep commits small and focused on a single task or issue.
   - Update documentation and README files as needed to reflect code changes.

3. ## Naming Conventions

- Use camelCase for variables, functions, and methods
- Use ALL_CAPS for constants
- When writing subCategory the C should always be capatilized in file name, function name, and variables

4. ## Coding Conventions

- Do not use default exports only named exports
- No magic numbers
- No magic text
- Use early returns for error handling when possible

5. ## Error Handling

- Use try/catch blocks for async operations
- Always log errors with contextual information

6. ## Writing Jest Unit Tests In packages/backend

- Structure unit tests using `describe` and `it` blocks
- `describe` blocks should follow structure: "when ABC occurs"
- `it` blocks should follow structure: "should do/return XYZ"
- Use prefix "fake" for faked variables in a test
- Use prefix "mock" for mocked functions in a test

7. ## Writing E2E Playwright Tests

- Structure unit tests using `describe` and `test` blocks
- `describe` blocks should follow structure: "when ABC occurs"
- `test` blocks should follow structure: "should do/return XYZ"

8. ## Backend Commands

- Needs to be run in ./packages/backend
- Run all unit tests: npm run test:unit
- Run all e2e tests: npm run test:e2e
- Run specific e2e test: npm run e2e:test {path to test relativel to backend package root}

9. ## Writing Vitest Unit Tests In packages/frontend

- Use vitest for all unit tests. Do not use jest.
- Structure unit tests using `describe` and `it` blocks
- `describe` blocks should follow structure: "when ABC occurs"
- `it` blocks should follow structure: "should do/return XYZ"
- Use prefix "fake" for faked variables in a test
- Use prefix "mock" for mocked functions in a test
