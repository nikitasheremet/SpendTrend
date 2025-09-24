import { ExpenseSubCategory } from '@/types/expenseData'
import { ExpenseSubCategory as ContractExpenseSubCategory } from '@contracts/expenseSubCategory/models'
import { mapExpenseSubCategory } from './apiExpenseSubCategoryToDomain'

export function deleteExpenseSubCategoryResponseToDomainExpenseSubCategory(
  contractExpenseSubCategory: ContractExpenseSubCategory,
): ExpenseSubCategory {
  console.log('Mapping deleted contract subcategory to domain:', contractExpenseSubCategory)
  return mapExpenseSubCategory(contractExpenseSubCategory)
}
