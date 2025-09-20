import { incomeTable } from '../../db/schema'

export interface Income {
  id: string // UUID
  userId: string // UUID
  accountId: string // UUID
  name: string
  amount: number
  date: string // YYYY-MM-DD
  createdAt: Date
  updatedAt: Date
}

export type IncomeDbRow = typeof incomeTable.$inferSelect