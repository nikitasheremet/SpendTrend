import { db } from '../db'
import { expensesTable } from '../db/schema'
import { Expense } from '../models/expense/Expense'
import { dbExpenseToDomainExpense } from '../utilities/mappers/expense/DBExpenseToDomainExpense'

export interface CreateExpense {
  userId: string
  accountId: string
  name: string
  amount: number
  netAmount: number
  date: string
  category: string
  subCategory: string
  paidBackAmount: number
  createdAt: Date
  updatedAt: Date
}

export async function createExpenseRepository(input: CreateExpense): Promise<Expense> {
  const createdExpense = await db
    .insert(expensesTable)
    .values({
      userId: input.userId,
      accountId: input.accountId,
      name: input.name,
      amount: input.amount,
      date: input.date,
      category: input.category,
      subCategory: input.subCategory,
      paidBackAmount: input.paidBackAmount,
      netAmount: input.netAmount,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    })
    .returning()

  return dbExpenseToDomainExpense(createdExpense[0])
}
