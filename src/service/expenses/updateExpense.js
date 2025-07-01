import { updateExpense as repoUpdateExpense } from '@/repository/expenses/updateExpense';
export async function updateExpense(updatedExpense) {
    return await repoUpdateExpense(updatedExpense);
}
