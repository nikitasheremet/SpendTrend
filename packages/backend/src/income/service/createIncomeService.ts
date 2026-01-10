import { decimalToInteger } from '../../utilities/decimalToInteger'
import { integerToDecimal } from '../../utilities/integerToDecimal'
import { CreateIncome, createIncomeRepository } from '../repository/createIncomeRepository'
import { CreateIncomesInput } from '../validation/models'
import { Income } from '../../models/income/income'

export async function createIncomeService(input: CreateIncomesInput): Promise<{
  createdIncomes: Array<Income>
  failedIncomes: Array<{ incomeInput: CreateIncome; errorMessage: string }>
}> {
  const createdIncomes: Array<Income> = []
  const failedIncomes: Array<{ incomeInput: CreateIncome; errorMessage: string }> = []

  for (const incomeInput of input.incomesToCreate) {
    const createIncomeDetails: CreateIncome = {
      userId: input.userId,
      accountId: input.accountId,
      ...incomeInput,
      amount: decimalToInteger(incomeInput.amount),
    }

    try {
      const createdIncome = await createIncomeRepository(createIncomeDetails)
      createdIncome.amount = integerToDecimal(createdIncome.amount)
      createdIncomes.push(createdIncome)
    } catch (error) {
      failedIncomes.push({
        incomeInput: createIncomeDetails,
        errorMessage: (error as Error).message,
      })
    }
  }

  return { createdIncomes, failedIncomes }
}
