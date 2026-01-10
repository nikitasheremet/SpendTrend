export interface NewIncome {
  name?: string
  amount?: number
  date?: string // YYYY-MM-DD
}

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

export interface FailedIncome {
  incomeInput: NewIncome
  errorMessage: string
}
