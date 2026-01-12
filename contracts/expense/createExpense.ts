import { Expense, NewExpense } from './models'

export type CreateExpenseResponse = {
  createdExpenses: {
    createdExpenses: Array<Expense>
    failedExpenses: Array<{ expenseInput: NewExpense; errorMessage: string }>
  }
}
