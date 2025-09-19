import { Income, IncomeDbRow } from '../../../models/income/income'

export function dbIncomeToDomainIncome(dbIncome: IncomeDbRow): Income {
  return {
    id: dbIncome.id,
    userId: dbIncome.userId,
    accountId: dbIncome.accountId,
    name: dbIncome.name,
    amount: dbIncome.amount,
    date: dbIncome.date,
    createdAt: dbIncome.createdAt,
    updatedAt: dbIncome.updatedAt,
  }
}

export function dbIncomeToDomainIncomes(dbIncomes: IncomeDbRow[]): Income[] {
  return dbIncomes.map(dbIncomeToDomainIncome)
}
