import { writeExpenseTransaction } from '@/localDb/schema/expensesObjectStore';
export function updateExpense(updatedExpense) {
    return new Promise((resolve, reject) => {
        const expenseObjectStore = writeExpenseTransaction();
        const updateRequest = expenseObjectStore.put(updatedExpense);
        updateRequest.onsuccess = () => {
            resolve(updatedExpense);
        };
        updateRequest.onerror = () => {
            reject(updateRequest.error);
        };
    });
}
