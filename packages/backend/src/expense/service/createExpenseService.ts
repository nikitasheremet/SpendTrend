import { decimalToInteger } from '../../utilities/decimalToInteger'
import { CreateExpense, createExpenseRepository } from '../repository/createExpenseRepository'
import { CreateExpenseInput } from '../validation/models'

import { integerToDecimal } from '../../utilities/integerToDecimal'
import { convertDbAmountToDecimals } from './helpers/convertDbAmountToDecimals'
import { convertDomainAmountToInteger } from './helpers/convertDomainAmountToInteger'
export async function createExpenseService(input: CreateExpenseInput) {
  const createExpenseInputs: CreateExpense = {
    ...input,
    ...convertDomainAmountToInteger({
      amount: input.amount,
      paidBackAmount: input.paidBackAmount,
      netAmount: input.netAmount,
    }),
  }
  let createdExpense = await createExpenseRepository(createExpenseInputs)
  createdExpense = convertDbAmountToDecimals(createdExpense)

  return createdExpense
}
