export interface CreateExpenseResponse {
  id: string // UUID
  userId: string // UUID
  accountId: string // UUID
  name: string
  amount: number
  netAmount: number
  date: string // YYYY-MM-DD
  category: ExpenseCategory
  subCategory?: ExpenseSubCategory
  paidBackAmount: number
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseCategory {
  id: string // UUID
  userId: string // UUID
  accountId: string // UUID
  name: string
  subCategories: ExpenseSubCategory[]
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseSubCategory {
  id: string // UUID
  userId: string // UUID
  accountId: string // UUID
  name: string
  categoryId: string // UUID
  createdAt: Date
  updatedAt: Date
}
