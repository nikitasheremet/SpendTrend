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
import type { ExpenseSummaryCalculatorI } from './interaface'
import { getFirstAndLastDayForMonth } from './helpers/getFirstAndLastDayForMonth'
import { getExpensesForDateRange } from '@/service/expenses/getExpensesForDateRange'

export class ExpenseSummaryCalculator implements ExpenseSummaryCalculatorI {
  private selectedMonth: number
  private selectedYear: number
  private selectedMonthAsDate: Date

  constructor(selectedMonth: number, selectedYear: number) {
    this.selectedMonth = selectedMonth
    this.selectedYear = selectedYear
    this.selectedMonthAsDate = new Date(this.selectedYear, this.selectedMonth, 15)
  }

  async getExpenseSummaryForSelectedMonth(): Promise<ExpenseSummaryForMonth> {
    return await this.compileExpenseSummaryForSelectedMonth()
  }

  async getExpenseSummaryByCategory(): Promise<ExpenseSummaryByCategory> {
    return await this.compileExpenseSummaryByCategory()
  }

  private async compileExpenseSummaryForSelectedMonth(): Promise<ExpenseSummaryForMonth> {
    const totalAmount = await this.totalForSelectedMonth()
    const threeMonthAverage = await this.threeMonthAverageForSelectedMonth()
    return {
      totalAmount,
      threeMonthAverage,
      diffTotalToAverage: this.diffTotalToAverage(totalAmount, threeMonthAverage),
      diffTotalToAverageAsPercent: this.diffTotalToAverageAsPercent(totalAmount, threeMonthAverage),
    }
  }

  private async compileExpenseSummaryByCategory(): Promise<ExpenseSummaryByCategory> {
    const categories = store.getCategories()
    const expenseSummaryByCategory: ExpenseSummaryByCategory = {}
    const categoriesExpenseSummaries = await Promise.all(
      categories.map(async (category) => {
        const categoryExpenseCategory = await this.compileExpenseSummary(category)
        return {
          ...categoryExpenseCategory,
          subcategories: await this.compileExpenseSummaryBySubcategory(category),
        }
      }),
    )
    categories.forEach((category, index) => {
      expenseSummaryByCategory[category] = categoriesExpenseSummaries[index]
    })
    return expenseSummaryByCategory
  }

  private async compileExpenseSummaryBySubcategory(
    category: string,
  ): Promise<ExpenseSummaryBySubcategory> {
    const subcategories = store.getSubcategoriesForCategory(category)

    const expenseSummaryBySubcategory: ExpenseSummaryBySubcategory = {}
    const subcategoriesSummaries = await Promise.all(
      subcategories.map(async (subcategory) => {
        return await this.compileExpenseSummary(category, subcategory)
      }),
    )
    subcategories.forEach((subcategory, index) => {
      expenseSummaryBySubcategory[subcategory] = subcategoriesSummaries[index]
    })
    return expenseSummaryBySubcategory
  }

  private async compileExpenseSummary(
    category: string,
    subcategory?: string,
  ): Promise<MonthDetails> {
    const total = await this.categoryTotalForSelectedMonth(category, subcategory)
    const threeMonthAverage = await this.categoryThreeMonthAverage(category, subcategory)
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

  private async getExpensesForSelectedMonth(): Promise<Expense[]> {
    const desiredDateRange = getFirstAndLastDayForMonth(this.selectedMonthAsDate)
    const expensesForSelectedMonth = await getExpensesForDateRange(desiredDateRange)
    return expensesForSelectedMonth
  }

  private async totalForSelectedMonth(): Promise<number> {
    return calculateTotalForListOfExpenses(await this.getExpensesForSelectedMonth())
  }

  private async threeMonthAverageForSelectedMonth(): Promise<number> {
    const selectedMonthYearDate = this.selectedMonthAsDate

    const totalsForLastThreeMonths = await Promise.all(
      [1, 2, 3].map(async (monthOffset) => {
        const expenseDate = new Date(
          selectedMonthYearDate.getUTCFullYear(),
          selectedMonthYearDate.getUTCMonth() - monthOffset,
          15,
        )
        const startEndDate = getFirstAndLastDayForMonth(expenseDate)
        const expensesForMonth = await getExpensesForDateRange(startEndDate)
        return calculateTotalForListOfExpenses(expensesForMonth)
      }),
    )

    const [totalForMinusOneMonth, totalForMinusTwoMonth, totalForMinusThreeMonth] =
      totalsForLastThreeMonths

    const numberToRound =
      (totalForMinusOneMonth + totalForMinusTwoMonth + totalForMinusThreeMonth) / 3
    return roundNumber(numberToRound, 2)
  }

  private diffTotalToAverage(total: number, average: number): number {
    const numberToRound = total - average
    return roundNumber(numberToRound, 2)
  }

  private diffTotalToAverageAsPercent(total: number, average: number): number {
    const numberToRound = (this.diffTotalToAverage(total, average) / average) * 100

    return roundNumber(numberToRound, 2)
  }

  private async categoryTotalForSelectedMonth(
    category: string,
    subcategory?: string,
  ): Promise<number> {
    const selectedMonthYearDate = new Date(this.selectedYear, this.selectedMonth, 1)
    const startEndDate = getFirstAndLastDayForMonth(selectedMonthYearDate)
    const expensesForMonth = await getExpensesForDateRange(startEndDate, { category, subcategory })
    const numberToRound = calculateTotalForListOfExpenses(expensesForMonth)
    return roundNumber(numberToRound, 2)
  }

  private async categoryThreeMonthAverage(category: string, subcategory?: string): Promise<number> {
    const selectedMonthYearDate = this.selectedMonthAsDate

    const totalsForLastThreeMonths = await Promise.all(
      [1, 2, 3].map(async (monthOffset) => {
        const expenseDate = new Date(
          selectedMonthYearDate.getUTCFullYear(),
          selectedMonthYearDate.getUTCMonth() - monthOffset,
          15,
        )
        const startEndDate = getFirstAndLastDayForMonth(expenseDate)
        const expensesForMonth = await getExpensesForDateRange(startEndDate, {
          category,
          subcategory,
        })
        return calculateTotalForListOfExpenses(expensesForMonth)
      }),
    )

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
