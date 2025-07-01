import { deleteExpense as repoDeleteExpense } from '@/repository/expenses/deleteExpense';
export async function deleteExpense(expenseId) {
    return await repoDeleteExpense(expenseId);
}
