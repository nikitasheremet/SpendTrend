import { Expense } from '../../../models/expense/expense'
import { decimalToInteger } from '../../../utilities/decimalToInteger'

interface amountFieldsToConvert {
  amount?: number
  paidBackAmount?: number
  netAmount?: number
}
export function convertDomainAmountToInteger(
  expense: amountFieldsToConvert,
): amountFieldsToConvert {
  return {
    ...(expense.amount && { amount: decimalToInteger(expense.amount) }),
    ...(expense.paidBackAmount && { paidBackAmount: decimalToInteger(expense.paidBackAmount) }),
    ...(expense.netAmount && { netAmount: decimalToInteger(expense.netAmount) }),
  }
}
