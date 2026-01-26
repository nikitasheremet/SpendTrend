export enum DataType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export interface FormattedBankData {
  type: DataType
  date?: string
  name: string
  amount: number
}
