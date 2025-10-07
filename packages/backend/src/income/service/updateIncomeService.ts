import { decimalToInteger } from '../../utilities/decimalToInteger'
import { updateIncomeRepository } from '../repository/updateIncomeRepository'
import { UpdateIncomeInput } from '../validation/models'

export async function updateIncomeService(input: UpdateIncomeInput) {
  const { id, accountId, ...otherFields } = input
  const fieldsToUpdate = {
    ...otherFields,
    ...(otherFields.amount && { amount: decimalToInteger(otherFields.amount) }),
    updatedAt: new Date(),
  }
  const incomeDbUpdateInput = {
    id,
    fieldsToUpdate,
  }
  const updatedIncome = await updateIncomeRepository(incomeDbUpdateInput)
  updatedIncome.amount = decimalToInteger(updatedIncome.amount)
  return updatedIncome
}
