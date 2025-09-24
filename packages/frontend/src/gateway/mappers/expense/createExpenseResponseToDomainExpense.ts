import { Expense } from '@/types/expenseData'
import { CreateExpenseResponse } from '@contracts/expense/createExpense'
import { mapExpenseCategory } from '../expenseCategory/apiExpenseCategoryToDomain'
import { mapExpenseSubCategory } from '../expenseSubCategory/apiExpenseSubCategoryToDomain'

export function createExpenseResponseToDomainExpense(response: CreateExpenseResponse): Expense {
  return {
    id: response.id,
    userId: response.userId,
    accountId: response.accountId,
    date: response.date,
    name: response.name,
    netAmount: response.netAmount,
    amount: response.amount,
    paidBackAmount: response.paidBackAmount,
    category: mapExpenseCategory(response.category),
    subCategory: response.subCategory ? mapExpenseSubCategory(response.subCategory) : undefined,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  }
}
