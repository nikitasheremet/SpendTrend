import { CreateExpense, createExpenseRepository } from '../repository/createExpensesRepository'

export interface CreateExpenseInput {
  userId: string
  accountId: string
  name: string
  amount: number
  netAmount: number
  date: string
  category: string
  subCategory: string
  paidBackAmount: number
}

export async function createExpenseService(input: CreateExpenseInput) {
  const createExpenseInputs: CreateExpense = {
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  return createExpenseRepository(createExpenseInputs)
}
