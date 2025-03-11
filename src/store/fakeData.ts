function getRandomNumberBetween0And30(): number {
  return Math.floor(Math.random() * 31)
}

const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

const currentMonthExpenseDate = new Date(
  currentYear,
  currentMonth,
  getRandomNumberBetween0And30(),
).getTime()
const minusOneMonthExpenseDate = new Date(currentYear, currentMonth - 1, 1).getTime()
const minusTwoMonthExpenseDate = new Date(currentYear, currentMonth - 2, 1).getTime()
const minusThreeMonthExpenseDate = new Date(currentYear, currentMonth - 3, 1).getTime()

export const fakeExpenseData = [
  // Current Month
  // Total: 1120
  {
    id: '123',
    date: currentMonthExpenseDate,
    name: 'Grocery Shopping',
    netAmount: 40,
    amount: 40,
    paidBackAmount: 0,
    category: 'Food',
    subCategory: 'Groceries',
  },
  {
    id: '456',
    date: currentMonthExpenseDate,
    name: 'Mortgage',
    netAmount: 30,
    amount: 30,
    paidBackAmount: 0,
    category: 'Home Core',
    subCategory: 'Mortgage',
  },
  {
    id: '789',
    date: currentMonthExpenseDate,
    name: 'Netflix Subscription',
    netAmount: 35,
    amount: 35,
    paidBackAmount: 0,
    category: 'Subscription',
    subCategory: 'Netflix',
  },
  // Minus ONE Month
  // Total: 100
  {
    id: '7891',
    date: minusOneMonthExpenseDate,
    name: 'Netflix',
    netAmount: 20,
    amount: 20,
    paidBackAmount: 0,
    category: 'Subscription',
    subCategory: 'Netflix',
  },
  {
    id: '7892',
    date: minusOneMonthExpenseDate,
    name: 'Phone',
    netAmount: 60,
    amount: 60,
    paidBackAmount: 0,
    category: 'Subscription',
    subCategory: 'Phone',
  },
  {
    id: '7893',
    date: minusOneMonthExpenseDate,
    name: 'Loan Payment',
    netAmount: 20,
    amount: 20,
    paidBackAmount: 0,
    category: 'Car',
    subCategory: 'Loan',
  },
  // Minus TWO Months
  // Total: 45.5
  {
    id: '7895',
    date: minusTwoMonthExpenseDate,
    name: 'Netflix',
    netAmount: 20,
    amount: 20,
    paidBackAmount: 0,
    category: 'Subscription',
    subCategory: 'Netflix',
  },
  {
    id: '7896',
    date: minusTwoMonthExpenseDate,
    name: 'Parking',
    netAmount: 5.5,
    amount: 5.5,
    paidBackAmount: 0,
    category: 'Car',
    subCategory: 'Parking',
  },
  {
    id: '7897',
    date: minusTwoMonthExpenseDate,
    name: 'Gift',
    netAmount: 20,
    amount: 20,
    paidBackAmount: 0,
    category: 'Gift',
    subCategory: '',
  },
  // Minus THREE Months
  // 150
  {
    id: '78911',
    date: minusThreeMonthExpenseDate,
    name: 'Insurance',
    netAmount: 110,
    amount: 110,
    paidBackAmount: 0,
    category: 'Car',
    subCategory: 'Insurance',
  },
  {
    id: '78922',
    date: minusThreeMonthExpenseDate,
    name: 'Massage',
    netAmount: 10,
    amount: 100,
    paidBackAmount: 90,
    category: 'Service',
    subCategory: 'Massage',
  },
  {
    id: '78933',
    date: minusThreeMonthExpenseDate,
    name: 'Chiro',
    netAmount: 30,
    amount: 130,
    paidBackAmount: 100,
    category: 'Service',
    subCategory: 'Chiropractor',
  },
]
