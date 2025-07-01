import { calculateTotalForListOfExpenses } from './helpers/calculateTotalForListOfExpenses';
import { roundNumber } from './helpers/roundNumber';
import { getFirstAndLastDayForMonth } from './helpers/getFirstAndLastDayForMonth';
import { getExpensesForDateRange } from '@/service/expenses/getExpensesForDateRange';
import { getCategories } from '@/service/categories/getCategories';
export class ExpenseSummaryCalculator {
    selectedMonth;
    selectedYear;
    selectedMonthAsDate;
    constructor(selectedMonth, selectedYear) {
        this.selectedMonth = selectedMonth;
        this.selectedYear = selectedYear;
        this.selectedMonthAsDate = new Date(this.selectedYear, this.selectedMonth, 15);
    }
    async getExpenseSummaryForSelectedMonth() {
        return await this.compileExpenseSummaryForSelectedMonth();
    }
    async getExpenseSummaryByCategory() {
        return await this.compileExpenseSummaryByCategory();
    }
    async compileExpenseSummaryForSelectedMonth() {
        const totalAmount = await this.totalForSelectedMonth();
        const threeMonthAverage = await this.threeMonthAverageForSelectedMonth();
        return {
            totalAmount,
            threeMonthAverage,
            diffTotalToAverage: this.diffTotalToAverage(totalAmount, threeMonthAverage),
            diffTotalToAverageAsPercent: this.diffTotalToAverageAsPercent(totalAmount, threeMonthAverage),
        };
    }
    async compileExpenseSummaryByCategory() {
        const categories = await getCategories();
        const expenseSummaryByCategory = {};
        const categoriesExpenseSummaries = await Promise.all(categories.map(async (category) => {
            const categoryExpenseCategory = await this.compileExpenseSummary(category.name);
            return {
                ...categoryExpenseCategory,
                subcategories: await this.compileExpenseSummaryBySubcategory(category.name),
            };
        }));
        categories.forEach((category, index) => {
            expenseSummaryByCategory[category.name] = categoriesExpenseSummaries[index];
        });
        return expenseSummaryByCategory;
    }
    async compileExpenseSummaryBySubcategory(category) {
        const categories = await getCategories();
        const categoryData = categories.find((cat) => cat.name === category);
        const subcategories = categoryData?.subcategories || [];
        const expenseSummaryBySubcategory = {};
        const subcategoriesSummaries = await Promise.all(subcategories.map(async (subcategory) => {
            return await this.compileExpenseSummary(category, subcategory);
        }));
        subcategories.forEach((subcategory, index) => {
            expenseSummaryBySubcategory[subcategory] = subcategoriesSummaries[index];
        });
        return expenseSummaryBySubcategory;
    }
    async compileExpenseSummary(category, subcategory) {
        const total = await this.categoryTotalForSelectedMonth(category, subcategory);
        const threeMonthAverage = await this.categoryThreeMonthAverage(category, subcategory);
        const diffTotalToAverage = this.categoryDiffTotalToAverage(total, threeMonthAverage);
        return {
            totalAmount: total,
            threeMonthAverage: threeMonthAverage,
            diffTotalToAverage: diffTotalToAverage,
            diffTotalToAverageAsPercent: this.categoryDiffTotalToAverageAsPercent(diffTotalToAverage, threeMonthAverage),
        };
    }
    async getExpensesForSelectedMonth() {
        const desiredDateRange = getFirstAndLastDayForMonth(this.selectedMonthAsDate);
        const expensesForSelectedMonth = await getExpensesForDateRange(desiredDateRange);
        return expensesForSelectedMonth;
    }
    async totalForSelectedMonth() {
        return calculateTotalForListOfExpenses(await this.getExpensesForSelectedMonth());
    }
    async threeMonthAverageForSelectedMonth() {
        const selectedMonthYearDate = this.selectedMonthAsDate;
        const totalsForLastThreeMonths = await Promise.all([1, 2, 3].map(async (monthOffset) => {
            const expenseDate = new Date(selectedMonthYearDate.getUTCFullYear(), selectedMonthYearDate.getUTCMonth() - monthOffset, 15);
            const startEndDate = getFirstAndLastDayForMonth(expenseDate);
            const expensesForMonth = await getExpensesForDateRange(startEndDate);
            return calculateTotalForListOfExpenses(expensesForMonth);
        }));
        const [totalForMinusOneMonth, totalForMinusTwoMonth, totalForMinusThreeMonth] = totalsForLastThreeMonths;
        const numberToRound = (totalForMinusOneMonth + totalForMinusTwoMonth + totalForMinusThreeMonth) / 3;
        return roundNumber(numberToRound, 2);
    }
    diffTotalToAverage(total, average) {
        const numberToRound = total - average;
        return roundNumber(numberToRound, 2);
    }
    diffTotalToAverageAsPercent(total, average) {
        const numberToRound = (this.diffTotalToAverage(total, average) / average) * 100;
        return roundNumber(numberToRound, 2);
    }
    async categoryTotalForSelectedMonth(category, subcategory) {
        const selectedMonthYearDate = new Date(this.selectedYear, this.selectedMonth, 1);
        const startEndDate = getFirstAndLastDayForMonth(selectedMonthYearDate);
        const expensesForMonth = await getExpensesForDateRange(startEndDate, { category, subcategory });
        const numberToRound = calculateTotalForListOfExpenses(expensesForMonth);
        return roundNumber(numberToRound, 2);
    }
    async categoryThreeMonthAverage(category, subcategory) {
        const selectedMonthYearDate = this.selectedMonthAsDate;
        const totalsForLastThreeMonths = await Promise.all([1, 2, 3].map(async (monthOffset) => {
            const expenseDate = new Date(selectedMonthYearDate.getUTCFullYear(), selectedMonthYearDate.getUTCMonth() - monthOffset, 15);
            const startEndDate = getFirstAndLastDayForMonth(expenseDate);
            const expensesForMonth = await getExpensesForDateRange(startEndDate, {
                category,
                subcategory,
            });
            return calculateTotalForListOfExpenses(expensesForMonth);
        }));
        const [totalForMinusOneMonth, totalForMinusTwoMonth, totalForMinusThreeMonth] = totalsForLastThreeMonths;
        const numberToRound = (totalForMinusOneMonth + totalForMinusTwoMonth + totalForMinusThreeMonth) / 3;
        return roundNumber(numberToRound, 2);
    }
    categoryDiffTotalToAverage(categoryTotal, categoryThreeMonthAverage) {
        const numberToRound = categoryTotal - categoryThreeMonthAverage;
        return roundNumber(numberToRound, 2);
    }
    categoryDiffTotalToAverageAsPercent(categoryDiffTotalToAverage, categoryThreeMonthAverage) {
        const numberToRound = (categoryDiffTotalToAverage / categoryThreeMonthAverage) * 100;
        return roundNumber(numberToRound, 2);
    }
}
