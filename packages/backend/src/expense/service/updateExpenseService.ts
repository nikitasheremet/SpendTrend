import { updateExpenseRepository } from '../repository/updateExpenseRepository'
import { UpdateExpenseInput } from '../validation/models'

export async function updateExpenseService(input: UpdateExpenseInput) {
  const { id, accountId, ...otherFields } = input
  const fieldsToUpdate = {
    ...otherFields,
    updatedAt: new Date(),
  }
  const expenseDbUpdateInput = {
    id,
    fieldsToUpdate,
  }
  const updatedExpense = await updateExpenseRepository(expenseDbUpdateInput)
  return updatedExpense
}
