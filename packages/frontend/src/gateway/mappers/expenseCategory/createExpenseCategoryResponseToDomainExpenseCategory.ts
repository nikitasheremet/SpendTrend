import {
  ExpenseCategory,
  ExpenseSubCategory as DomainExpenseSubCategory,
} from '@/types/expenseData'
import {
  ExpenseCategory as ContractExpenseCategory,
  ExpenseSubCategory as ContractExpenseSubCategory,
} from '@contracts/expenseCategory/createExpenseCategory'

export function createExpenseCategoryResponseToDomainExpenseCategory(
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

function mapExpenseSubCategory(contractSub: ContractExpenseSubCategory): DomainExpenseSubCategory {
  return {
    id: contractSub.id,
    userId: contractSub.userId,
    accountId: contractSub.accountId,
    name: contractSub.name,
    createdAt: contractSub.createdAt,
    updatedAt: contractSub.updatedAt,
  }
}
