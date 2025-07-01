import { db } from '@/localDb/db';
export async function getExpenses() {
    const dbExpenses = await new Promise((resolve, reject) => {
        const transaction = db.transaction('expenses', 'readonly');
        const objectStore = transaction.objectStore('expenses');
        const request = objectStore.getAll();
        request.onsuccess = (event) => {
            resolve(request.result);
        };
    });
    return convertDbExpensesToExpenses(dbExpenses);
}
function convertDbExpensesToExpenses(dbExpenses) {
    return dbExpenses.map((expense) => convertDbExpenseToExpense(expense));
}
function convertDbExpenseToExpense(dbExpense) {
    return {
        id: dbExpense.id,
        date: dbExpense.date,
        name: dbExpense.name,
        netAmount: dbExpense.netAmount,
        amount: dbExpense.amount,
        paidBackAmount: dbExpense.paidBackAmount,
        category: dbExpense.category,
        subCategory: dbExpense.subCategory,
    };
}
