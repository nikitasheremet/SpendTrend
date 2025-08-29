import { CreateExpense, createExpenseRepository } from '../repository/createExpenseRepository'
import { CreateExpenseInput } from '../validation/models'

export async function createExpenseService(input: CreateExpenseInput) {
  const createExpenseInputs: CreateExpense = {
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  return createExpenseRepository(createExpenseInputs)
}
