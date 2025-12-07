import { ExpenseSubCategory } from '@/types/expenseData'
import { ExpenseSubCategory as ContractExpenseSubCategory } from '@contracts/expenseSubCategory/models'
import { mapExpenseSubCategory } from './apiExpenseSubCategoryToDomain'

export function updateExpenseSubCategoryResponseToDomainExpenseSubCategory(
  contractExpenseSubCategory: ContractExpenseSubCategory,
): ExpenseSubCategory {
  return mapExpenseSubCategory(contractExpenseSubCategory)
}
