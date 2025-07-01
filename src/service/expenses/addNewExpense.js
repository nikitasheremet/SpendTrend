import { saveExpense } from '@/repository/expenses/saveExpense';
export async function addNewExpense(newExpenseData) {
    return await saveExpense(newExpenseData);
}
