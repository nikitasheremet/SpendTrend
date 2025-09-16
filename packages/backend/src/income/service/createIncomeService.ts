import { CreateIncome, createIncomeRepository } from '../repository/createIncomeRepository'
import { CreateIncomeInput } from '../validation/models'

export async function createIncomeService(input: CreateIncomeInput) {
  const createIncomeInputs: CreateIncome = {
    ...input,
  }
  return createIncomeRepository(createIncomeInputs)
}
