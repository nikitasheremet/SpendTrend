import { Income, IncomeDbRow } from '../../../models/income/income'

export interface DbIncomeWithIncomeCategory extends IncomeDbRow {}

export function dbIncomeToDomainIncome(dbIncome: DbIncomeWithIncomeCategory): Income {
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

export function dbIncomeToDomainIncomes(dbIncomes: DbIncomeWithIncomeCategory[]): Income[] {
  return dbIncomes.map(dbIncomeToDomainIncome)
}
