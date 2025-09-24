import {
  ExpenseCategory,
  ExpenseSubCategory as DomainExpenseSubCategory,
} from '@/types/expenseData'
import {
  ExpenseCategory as ContractExpenseCategory,
  ExpenseSubCategory as ContractExpenseSubCategory,
} from '@contracts/expenseCategory/models'

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

export function mapExpenseSubCategory(
  contractSub: ContractExpenseSubCategory,
): DomainExpenseSubCategory {
  return {
    id: contractSub.id,
    userId: contractSub.userId,
    accountId: contractSub.accountId,
    name: contractSub.name,
    createdAt: contractSub.createdAt,
    updatedAt: contractSub.updatedAt,
  }
}
