import { Expense } from '@/types/expenseData'
import { Expense as ContractExpense } from '@contracts/expense/models'
import { mapExpenseCategory } from '../expenseCategory/apiExpenseCategoryToDomain'
import { mapExpenseSubCategory } from '../expenseSubCategory/apiExpenseSubCategoryToDomain'

export function apiExpenseToDomain(contractExpense: ContractExpense): Expense {
  return {
    id: contractExpense.id,
    userId: contractExpense.userId,
    accountId: contractExpense.accountId,
    date: contractExpense.date,
    name: contractExpense.name,
    netAmount: contractExpense.netAmount,
    amount: contractExpense.amount,
    paidBackAmount: contractExpense.paidBackAmount,
    category: mapExpenseCategory(contractExpense.category),
    subCategory: contractExpense.subCategory
      ? mapExpenseSubCategory(contractExpense.subCategory)
      : undefined,
    createdAt: contractExpense.createdAt,
    updatedAt: contractExpense.updatedAt,
  }
}
