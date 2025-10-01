import { updateIncomeRepository } from '../repository/updateIncomeRepository'
import { UpdateIncomeInput } from '../validation/models'

export async function updateIncomeService(input: UpdateIncomeInput) {
  const { id, accountId, ...otherFields } = input
  const fieldsToUpdate = {
    ...otherFields,
    updatedAt: new Date(),
  }
  const incomeDbUpdateInput = {
    id,
    fieldsToUpdate,
  }
  const updatedIncome = await updateIncomeRepository(incomeDbUpdateInput)
  return updatedIncome
}
