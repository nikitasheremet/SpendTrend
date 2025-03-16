import { store } from '@/store/store'
import type { Expense, ExpenseDate } from '@/types/expenseData'
import type {
  ExpenseSummaryByCategory,
  ExpenseSummaryBySubcategory,
  ExpenseSummaryForMonth,
  MonthDetails,
} from '@/types/expenseSummary'
import { calculateTotalForListOfExpenses } from './helpers/calculateTotalForListOfExpenses'
import { roundNumber } from './helpers/roundNumber'

export class ExpenseSummaryCalculator {
  private selectedMonth: number
  private selectedYear: number
  private expensesForSelectedMonth: Expense[]
  private expensesForLastThreeMonths: Expense[]
  private expenseSummaryByCategory: ExpenseSummaryByCategory

  private totalAmountForSelectedMonth: number
  private threeMonthAverageAmountForSelectedMonth: number

  constructor(selectedMonth: number, selectedYear: number) {
    this.selectedMonth = selectedMonth
    this.selectedYear = selectedYear
    this.expensesForSelectedMonth = this.getExpensesForSelectedMonth()
    this.totalAmountForSelectedMonth = this.totalForSelectedMonth()
    this.threeMonthAverageAmountForSelectedMonth = this.threeMonthAverageForSelectedMonth()

    this.expensesForLastThreeMonths = this.getExpensesForLastThreeMonths()
    this.expenseSummaryByCategory = this.compileExpenseSummaryByCategory()
  }

  getExpenseSummaryForSelectedMonth(): ExpenseSummaryForMonth {
    return this.compileExpenseSummaryForSelectedMonth()
  }

  getExpenseSummaryByCategory(): ExpenseSummaryByCategory {
    return this.compileExpenseSummaryByCategory()
  }

  private compileExpenseSummaryForSelectedMonth(): ExpenseSummaryForMonth {
    return {
      totalAmount: this.totalAmountForSelectedMonth,
      threeMonthAverage: this.threeMonthAverageAmountForSelectedMonth,
      diffTotalToAverage: this.diffTotalToAverage(),
      diffTotalToAverageAsPercent: this.diffTotalToAverageAsPercent(),
    }
  }

  private compileExpenseSummaryByCategory(): ExpenseSummaryByCategory {
    const categories = store.getCategories()
    const expenseSummaryByCategory: ExpenseSummaryByCategory = {}
    categories.forEach((category) => {
      expenseSummaryByCategory[category] = {
        ...this.compileExpenseSummary(category),
        subcategories: this.compileExpenseSummaryBySubcategory(category),
      }
    })
    return expenseSummaryByCategory
  }

  private compileExpenseSummaryBySubcategory(category: string): ExpenseSummaryBySubcategory {
    const subcategories = store.getSubcategoriesForCategory(category)

    const expenseSummaryBySubcategory: ExpenseSummaryBySubcategory = {}
    subcategories.forEach((subcategory) => {
      expenseSummaryBySubcategory[subcategory] = this.compileExpenseSummary(category, subcategory)
    })
    return expenseSummaryBySubcategory
  }

  private compileExpenseSummary(category: string, subcategory?: string): MonthDetails {
    const total = this.categoryTotalForSelectedMonth(category, subcategory)
    const threeMonthAverage = this.categoryThreeMonthAverage(category, subcategory)
    const diffTotalToAverage = this.categoryDiffTotalToAverage(total, threeMonthAverage)
    return {
      totalAmount: total,
      threeMonthAverage: threeMonthAverage,
      diffTotalToAverage: diffTotalToAverage,
      diffTotalToAverageAsPercent: this.categoryDiffTotalToAverageAsPercent(
        diffTotalToAverage,
        threeMonthAverage,
      ),
    }
  }

  private getExpensesForSelectedMonth(): Expense[] {
    const desiredDateRange = this.firstAndLastDayOfTheMonth(
      new Date(this.selectedYear, this.selectedMonth, 1),
    )
    const expensesForSelectedMonth = store.getExpensesForDateRange(desiredDateRange)
    return expensesForSelectedMonth
  }

  private firstAndLastDayOfTheMonth(date: Date): [ExpenseDate, ExpenseDate] {
    const beginningDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), 0).getTime()
    const endDate = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, -1).getTime()
    return [beginningDate, endDate]
  }

  private getExpensesForLastThreeMonths(): Expense[] {
    return []
  }

  private totalForSelectedMonth(): number {
    return calculateTotalForListOfExpenses(this.expensesForSelectedMonth)
  }

  private threeMonthAverageForSelectedMonth(): number {
    const selectedMonthYearDate = new Date(this.selectedYear, this.selectedMonth, 0)

    const totalsForLastThreeMonths = [1, 2, 3].map((monthOffset) => {
      const expenseDate = new Date(
        selectedMonthYearDate.getUTCFullYear(),
        selectedMonthYearDate.getUTCMonth() - monthOffset,
        1,
      )
      const startEndDate = this.firstAndLastDayOfTheMonth(expenseDate)
      const expensesForMonth = store.getExpensesForDateRange(startEndDate)
      return calculateTotalForListOfExpenses(expensesForMonth)
    })

    const [totalForMinusOneMonth, totalForMinusTwoMonth, totalForMinusThreeMonth] =
      totalsForLastThreeMonths

    const numberToRound =
      (totalForMinusOneMonth + totalForMinusTwoMonth + totalForMinusThreeMonth) / 3
    return roundNumber(numberToRound, 2)
  }

  private diffTotalToAverage(): number {
    const numberToRound =
      this.totalAmountForSelectedMonth - this.threeMonthAverageAmountForSelectedMonth
    return roundNumber(numberToRound, 2)
  }

  private diffTotalToAverageAsPercent(): number {
    const numberToRound =
      (this.diffTotalToAverage() / this.threeMonthAverageAmountForSelectedMonth) * 100

    return roundNumber(numberToRound, 2)
  }

  private categoryTotalForSelectedMonth(category: string, subcategory?: string): number {
    const selectedMonthYearDate = new Date(this.selectedYear, this.selectedMonth, 1)
    const startEndDate = this.firstAndLastDayOfTheMonth(selectedMonthYearDate)
    const expensesForMonth = store.getExpensesForDateRange(startEndDate, { category, subcategory })
    const numberToRound = calculateTotalForListOfExpenses(expensesForMonth)
    return roundNumber(numberToRound, 2)
  }

  private categoryThreeMonthAverage(category: string, subcategory?: string): number {
    const selectedMonthYearDate = new Date(this.selectedYear, this.selectedMonth, 15)

    const totalsForLastThreeMonths = [1, 2, 3].map((monthOffset) => {
      const expenseDate = new Date(
        selectedMonthYearDate.getUTCFullYear(),
        selectedMonthYearDate.getUTCMonth() - monthOffset,
        15,
      )
      const startEndDate = this.firstAndLastDayOfTheMonth(expenseDate)
      const expensesForMonth = store.getExpensesForDateRange(startEndDate, {
        category,
        subcategory,
      })
      return calculateTotalForListOfExpenses(expensesForMonth)
    })

    const [totalForMinusOneMonth, totalForMinusTwoMonth, totalForMinusThreeMonth] =
      totalsForLastThreeMonths

    const numberToRound =
      (totalForMinusOneMonth + totalForMinusTwoMonth + totalForMinusThreeMonth) / 3
    return roundNumber(numberToRound, 2)
  }

  private categoryDiffTotalToAverage(
    categoryTotal: number,
    categoryThreeMonthAverage: number,
  ): number {
    const numberToRound = categoryTotal - categoryThreeMonthAverage
    return roundNumber(numberToRound, 2)
  }

  private categoryDiffTotalToAverageAsPercent(
    categoryDiffTotalToAverage: number,
    categoryThreeMonthAverage: number,
  ): number {
    const numberToRound = (categoryDiffTotalToAverage / categoryThreeMonthAverage) * 100
    return roundNumber(numberToRound, 2)
  }
}
