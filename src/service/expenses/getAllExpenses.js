import { getExpenses } from '@/repository/expenses/getExpenses';
export async function getAllExpenses() {
    return await getExpenses();
}
