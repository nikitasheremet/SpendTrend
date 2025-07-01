import { writeExpenseTransaction } from '@/localDb/schema/expensesObjectStore';
export async function deleteExpense(expenseId) {
    return new Promise((resolve, reject) => {
        const expenseObjectStore = writeExpenseTransaction();
        const deleteRequest = expenseObjectStore.delete(expenseId);
        deleteRequest.onsuccess = () => {
            resolve(expenseId);
        };
        deleteRequest.onerror = () => {
            reject(deleteRequest.error);
        };
    });
}
