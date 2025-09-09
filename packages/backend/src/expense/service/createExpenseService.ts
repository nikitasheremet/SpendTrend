import { CreateExpense, createExpenseRepository } from '../repository/createExpenseRepository'
import { CreateExpenseInput } from '../validation/models'

export async function createExpenseService(input: CreateExpenseInput) {
  const createExpenseInputs: CreateExpense = {
    ...input,
  }
  return createExpenseRepository(createExpenseInputs)
}
