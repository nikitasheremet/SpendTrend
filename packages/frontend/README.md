# Testing Philosophy

# Testing Philosophy

In this project, unit tests focus on **pure inputs and outputs** of a component, while side effects and data flow across layers are covered in **integration tests**.

## Example: `AddExpenseTable.vue`

```vue
<script setup lang="ts">
import ExpenseDataTableHead from '../ExpenseDataTableHead.vue'
import AddNewExpenseRow from './AddNewExpenseRow.vue'
import { useAddExpense } from './hooks/useAddExpense'
import Error from '../DesignSystem/Error.vue'

const { newExpenseData, addExpense, error } = useAddExpense()
</script>

<template>
  <table>
    <ExpenseDataTableHead />
    <tbody>
      <AddNewExpenseRow v-model="newExpenseData" />
    </tbody>
  </table>
  <button @click="addExpense">Save Expense</button>
  <Error v-if="error" :error="error" />
</template>
```

## Unit Tests vs Integration Tests

### Unit Tests (Fast, Isolated)

- Verify static render output (table head, button, error message visibility).
- Check conditional rendering (e.g., `<Error>` only appears if error is set).
- Child components and hooks (`AddNewExpenseRow`, `useAddExpense`) are mocked or stubbed.

### Integration Tests (Slower, Higher Confidence)

- Mount the component with the real `useAddExpense` composable.
- Simulate typing into `<AddNewExpenseRow>` and saving → assert the expense is added.
- Simulate errors from the composable → assert `<Error>` displays the correct message.

### Rule of Thumb

- **Unit tests**: "Does this component render the right thing for a given state?"
- **Integration tests**: "Does this component behave correctly when its children and hooks run together?"
