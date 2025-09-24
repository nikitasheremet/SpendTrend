import { ExpenseSubCategory as DomainExpenseSubCategory } from '@/types/expenseData'
import { ExpenseSubCategory as ContractExpenseSubCategory } from '@contracts/expenseSubCategory/models'

export function mapExpenseSubCategory(
  contractSubCategory: ContractExpenseSubCategory,
): DomainExpenseSubCategory {
  console.log('Mapping contract subcategory to domain:', contractSubCategory)
  return {
    id: contractSubCategory.id,
    userId: contractSubCategory.userId,
    accountId: contractSubCategory.accountId,
    name: contractSubCategory.name,
    categoryId: contractSubCategory.categoryId,
    createdAt: contractSubCategory.createdAt,
    updatedAt: contractSubCategory.updatedAt,
  }
}
