import { Income } from '@/types/income/income'
import { getAllIncomes } from '../../../service/income/getAllIncomes'
import { onMounted, ref, type Ref } from 'vue'

export function useGetIncomes(): {
  incomes: Ref<Income[]>
  incomeDeleted: (deletedIncome: Income) => void
  error: Ref<Error | undefined>
} {
  const incomes = ref<Income[]>([])
  const error = ref<Error | undefined>(undefined)
  onMounted(() => {
    try {
      getAllIncomes().then((data) => {
        incomes.value = data
      })
    } catch (err) {
      error.value = err as Error
    }
  })
  const incomeDeleted = (deletedIncome: Income) => {
    const incomesWithoutDeletedIncome = incomes.value.filter(
      (income) => income.id !== deletedIncome.id,
    )
    incomes.value = incomesWithoutDeletedIncome
  }
  return {
    incomes,
    incomeDeleted,
    error,
  }
}
