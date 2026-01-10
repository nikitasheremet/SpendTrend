import { Income, NewIncome } from './models'

export type CreateIncomeResponse = {
  createdIncomes: Array<Income>
  failedIncomes: Array<{ incomeInput: NewIncome; errorMessage: string }>
}
