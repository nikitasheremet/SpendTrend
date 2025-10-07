import { Expense } from '../../../models/expense/expense'
import { integerToDecimal } from '../../../utilities/integerToDecimal'

export function convertDbAmountToDecimals(expense: Expense): Expense {
  return {
    ...expense,
    amount: integerToDecimal(expense.amount),
    paidBackAmount: integerToDecimal(expense.paidBackAmount),
    netAmount: integerToDecimal(expense.netAmount),
  }
}
