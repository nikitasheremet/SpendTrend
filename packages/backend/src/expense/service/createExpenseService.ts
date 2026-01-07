import { CreateExpense, createExpenseRepository } from '../repository/createExpenseRepository'
import { CreateExpensesInput } from '../validation/models'
import { convertDbAmountToDecimals } from './helpers/convertDbAmountToDecimals'
import { convertDomainAmountToInteger } from './helpers/convertDomainAmountToInteger'
import { Expense } from '../../models/expense/expense'

export async function createExpenseService(input: CreateExpensesInput): Promise<{
  createdExpenses: Array<Expense>
  failedExpenses: Array<{ expenseInput: CreateExpense; errorMessage: string }>
}> {
  const createdExpenses: Array<Expense> = []
  const failedExpenses: Array<{ expenseInput: CreateExpense; errorMessage: string }> = []

  for (const expenseInput of input.expensesToCreate) {
    let createExpenseDetails: CreateExpense = {
      userId: input.userId,
      accountId: input.accountId,
      ...expenseInput,
    }
    try {
      const createExpenseDetailsAsIntegers = {
        ...createExpenseDetails,
        ...convertDomainAmountToInteger({
          amount: expenseInput.amount,
          paidBackAmount: expenseInput.paidBackAmount,
          netAmount: expenseInput.netAmount,
        }),
      }

      let createdExpense = await createExpenseRepository(createExpenseDetailsAsIntegers)

      createdExpense = convertDbAmountToDecimals(createdExpense)

      createdExpenses.push(createdExpense)
    } catch (error) {
      failedExpenses.push({
        expenseInput: createExpenseDetails,
        errorMessage: (error as Error).message,
      })
    }
  }

  return { createdExpenses, failedExpenses }
}
