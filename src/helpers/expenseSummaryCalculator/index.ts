import { store } from '@/store/store'
import type { Expense, ExpenseDate } from '@/types/expenseData'
import type { ExpenseSummaryByCategory, ExpenseSummaryForMonth } from '@/types/expenseSummary'
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
    console.log('this.compileExpenseSummaryByCategory()', this.compileExpenseSummaryByCategory())
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
      const categoryTotal = this.categoryTotalForSelectedMonth(category)
      const categoryThreeMonthAverage = this.categoryThreeMonthAverage(category)
      const diffTotalToAverage = this.categoryDiffTotalToAverage(
        categoryTotal,
        categoryThreeMonthAverage,
      )

      expenseSummaryByCategory[category] = {
        totalAmount: categoryTotal,
        threeMonthAverage: categoryThreeMonthAverage,
        diffTotalToAverage: diffTotalToAverage,
        diffTotalToAverageAsPercent: this.categoryDiffTotalToAverageAsPercent(
          diffTotalToAverage,
          categoryThreeMonthAverage,
        ),
      }
    })
    return expenseSummaryByCategory
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

  private categoryTotalForSelectedMonth(category: string): number {
    const selectedMonthYearDate = new Date(this.selectedYear, this.selectedMonth, 1)
    const startEndDate = this.firstAndLastDayOfTheMonth(selectedMonthYearDate)
    const expensesForMonth = store.getExpensesForDateRange(startEndDate, { category })
    const numberToRound = calculateTotalForListOfExpenses(expensesForMonth)
    return roundNumber(numberToRound, 2)
  }

  private categoryThreeMonthAverage(category: string): number {
    const selectedMonthYearDate = new Date(this.selectedYear, this.selectedMonth, 0)

    const totalsForLastThreeMonths = [1, 2, 3].map((monthOffset) => {
      const expenseDate = new Date(
        selectedMonthYearDate.getUTCFullYear(),
        selectedMonthYearDate.getUTCMonth() - monthOffset,
        1,
      )
      const startEndDate = this.firstAndLastDayOfTheMonth(expenseDate)
      const expensesForMonth = store.getExpensesForDateRange(startEndDate, { category })
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
