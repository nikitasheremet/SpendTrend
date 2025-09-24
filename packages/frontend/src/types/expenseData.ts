export type ExpenseDate = string

export interface Expense {
  id: string
  userId: string
  accountId: string
  date: ExpenseDate
  name: string
  netAmount: number
  amount: number
  paidBackAmount?: number
  category: ExpenseCategory
  subCategory?: ExpenseSubCategory
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseCategory {
  id: string
  userId: string
  accountId: string
  name: string
  subCategories: ExpenseSubCategory[]
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseSubCategory {
  id: string
  userId: string
  accountId: string
  name: string
  categoryId: string
  createdAt: Date
  updatedAt: Date
}

export interface NewExpense {
  date: ExpenseDate
  name: string
  netAmount: number
  amount: number
  paidBackAmount?: number
  category: string
  subCategory: string
}

export interface NewExpenseCategory {
  name: string
}

export interface Category {
  name: string
  subcategories: string[]
}
