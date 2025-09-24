import { getAllExpenses } from '../../../service/expenses/getExpenses.js'
import type { Expense } from '@/types/expenseData'
import { onMounted, ref, type Ref } from 'vue'

export function useGetExpenses(): {
  expenses: Ref<Expense[]>
  expenseDeleted: (deletedExpense: Expense) => void
  error: Ref<Error | undefined>
} {
  const expenses = ref<Expense[]>([])
  const error = ref<Error | undefined>(undefined)
  onMounted(() => {
    try {
      getAllExpenses().then((data) => {
        expenses.value = data
      })
    } catch (err) {
      error.value = err as Error
    }
  })
  const expenseDeleted = (deletedExpense: Expense) => {
    const expensesWithoutDeletedExpense = expenses.value.filter(
      (expense) => expense.id !== deletedExpense.id,
    )
    expenses.value = expensesWithoutDeletedExpense
  }
  return {
    expenses,
    expenseDeleted,
    error,
  }
}
