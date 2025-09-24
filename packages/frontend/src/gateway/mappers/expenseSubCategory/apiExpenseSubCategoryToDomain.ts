import { ExpenseSubCategory as DomainExpenseSubCategory } from '@/types/expenseData'
import { ExpenseSubCategory as ContractExpenseSubCategory } from '@contracts/expenseSubCategory/models'

export function mapExpenseSubCategory(
  contractSub: ContractExpenseSubCategory,
): DomainExpenseSubCategory {
  return {
    id: contractSub.id,
    userId: contractSub.userId,
    accountId: contractSub.accountId,
    name: contractSub.name,
    categoryId: contractSub.categoryId,
    createdAt: contractSub.createdAt,
    updatedAt: contractSub.updatedAt,
  }
}
