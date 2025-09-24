import { ExpenseCategory } from '@/types/expenseData'
import { ExpenseCategory as ContractExpenseCategory } from '@contracts/expenseCategory/models'
import { mapExpenseSubCategory } from '../expenseSubCategory/apiExpenseSubCategoryToDomain'

export function mapExpenseCategory(
  contractExpenseCategory: ContractExpenseCategory,
): ExpenseCategory {
  return {
    id: contractExpenseCategory.id,
    userId: contractExpenseCategory.userId,
    accountId: contractExpenseCategory.accountId,
    name: contractExpenseCategory.name,
    subCategories: contractExpenseCategory.subCategories.map(mapExpenseSubCategory),
    createdAt: contractExpenseCategory.createdAt,
    updatedAt: contractExpenseCategory.updatedAt,
  }
}
