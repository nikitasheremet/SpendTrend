import { decimal } from 'drizzle-orm/gel-core'
import { updateExpenseRepository } from '../repository/updateExpenseRepository'
import { UpdateExpenseInput } from '../validation/models'
import { convertDomainAmountToInteger } from './helpers/convertDomainAmountToInteger'
import { convertDbAmountToDecimals } from './helpers/convertDbAmountToDecimals'

export async function updateExpenseService(input: UpdateExpenseInput) {
  const { id, accountId, ...otherFields } = input
  const fieldsToUpdate = {
    ...otherFields,
    ...convertDomainAmountToInteger({
      amount: input.amount,
      paidBackAmount: input.paidBackAmount,
      netAmount: input.netAmount,
    }),
    updatedAt: new Date(),
  }
  const expenseDbUpdateInput = {
    id,
    fieldsToUpdate,
  }
  let updatedExpense = await updateExpenseRepository(expenseDbUpdateInput)
  updatedExpense = convertDbAmountToDecimals(updatedExpense)
  return updatedExpense
}
