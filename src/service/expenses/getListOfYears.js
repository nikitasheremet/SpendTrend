import { getExpenses } from '@/repository/expenses/getExpenses';
export async function getListOfYears() {
    const allExpenses = await getExpenses();
    const years = allExpenses.map((expense) => {
        const date = new Date(expense.date);
        return date.getFullYear();
    });
    const uniqueYears = Array.from(new Set(years));
    return uniqueYears.sort((a, b) => b - a);
}
