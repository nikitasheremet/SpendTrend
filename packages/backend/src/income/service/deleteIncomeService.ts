import { Income } from '../../models/income/income'
import { integerToDecimal } from '../../utilities/integerToDecimal'
import { deleteIncomeRepository } from '../repository/deleteIncomeRepository'

export interface DeleteIncomeServiceInput {
  id: string
}

export async function deleteIncomeService(input: DeleteIncomeServiceInput): Promise<Income> {
  const deletedIncome = await deleteIncomeRepository({ id: input.id })
  deletedIncome.amount = integerToDecimal(deletedIncome.amount)
  return deletedIncome
}
