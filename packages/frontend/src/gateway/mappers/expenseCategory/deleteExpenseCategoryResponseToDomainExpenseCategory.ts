import { ExpenseCategory } from '@/types/expenseData'
import { ExpenseCategory as ContractExpenseCategory } from '@contracts/expenseCategory/models'
import { mapExpenseCategory } from './apiExpenseCategoryToDomain'

export function deleteExpenseCategoryResponseToDomainExpenseCategory(
  contractExpenseCategory: ContractExpenseCategory,
): ExpenseCategory {
  return mapExpenseCategory(contractExpenseCategory)
}
