export type ExpenseDate = number

export interface Expense {
  id: string
  date: ExpenseDate
  name: string
  netAmount: number
  amount: number
  paidBackAmount?: number
  category: string
  subCategory: string
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

export interface Category {
  name: string
  subcategories: string[]
}
