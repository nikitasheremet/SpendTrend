import { NewExpense as DomainNewExpense } from '@/types/expenseData'
import { NewExpense as ApiNewExpense } from '@contracts/expense/models'

type ApiFailedExpense = { expenseInput: ApiNewExpense; errorMessage: string }
type DomainFailedExpense = { expenseInput: DomainNewExpense; errorMessage: string }

function apiNewExpenseToDomain(input: ApiNewExpense): DomainNewExpense {
  return {
    date: input.date,
    name: input.name,
    netAmount: input.netAmount,
    amount: input.amount,
    paidBackAmount: input.paidBackAmount ?? undefined,
    category: input.categoryId,
    subCategory: input.subCategoryId ?? '',
  }
}

export function apiFailedExpenseToDomain(input: ApiFailedExpense): DomainFailedExpense {
  return {
    expenseInput: apiNewExpenseToDomain(input.expenseInput),
    errorMessage: input.errorMessage,
  }
}

export function apiFailedExpensesToDomain(input: ApiFailedExpense[]): DomainFailedExpense[] {
  return input.map(apiFailedExpenseToDomain)
}
