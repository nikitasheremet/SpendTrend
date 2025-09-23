import {
  Expense,
  ExpenseCategory,
  ExpenseSubCategory,
  ExpenseCategory as ResponseExpenseCategory,
  ExpenseSubCategory as ResponseExpenseSubCategory,
} from '@/types/expenseData'
import { CreateExpenseResponse } from '@contracts/expense/createExpense'

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

function mapExpenseSubCategory(contractSub: ResponseExpenseSubCategory): ExpenseSubCategory {
  return {
    id: contractSub.id,
    userId: contractSub.userId,
    accountId: contractSub.accountId,
    name: contractSub.name,
    createdAt: contractSub.createdAt,
    updatedAt: contractSub.updatedAt,
  }
}

function mapExpenseCategory(contractCategory: ResponseExpenseCategory): ExpenseCategory {
  return {
    id: contractCategory.id,
    userId: contractCategory.userId,
    accountId: contractCategory.accountId,
    name: contractCategory.name,
    subCategories: contractCategory.subCategories.map(mapExpenseSubCategory),
    createdAt: contractCategory.createdAt,
    updatedAt: contractCategory.updatedAt,
  }
}
