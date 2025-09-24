import { ExpenseCategory } from '@/types/expenseData'
import { ExpenseCategory as ContractExpenseCategory } from '@contracts/expenseCategory/models'
import { mapExpenseCategory } from './apiExpenseCategoryToDomain'

export function createExpenseCategoryResponseToDomainExpenseCategory(
  contractExpenseCategory: ContractExpenseCategory,
): ExpenseCategory {
  return mapExpenseCategory(contractExpenseCategory)
}
