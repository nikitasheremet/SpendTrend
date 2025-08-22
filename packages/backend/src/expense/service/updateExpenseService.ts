import { UpdateExpenseInput } from './models'

export async function updateExpenseService(input: UpdateExpenseInput) {
  return { id: input.id }
}
