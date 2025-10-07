import { decimalToInteger } from '../../utilities/decimalToInteger'
import { integerToDecimal } from '../../utilities/integerToDecimal'
import { CreateIncome, createIncomeRepository } from '../repository/createIncomeRepository'
import { CreateIncomeInput } from '../validation/models'

export async function createIncomeService(input: CreateIncomeInput) {
  const createIncomeInputs: CreateIncome = { ...input, amount: decimalToInteger(input.amount) }
  const createdIncome = await createIncomeRepository(createIncomeInputs)
  createdIncome.amount = integerToDecimal(createdIncome.amount)
  return createdIncome
}
