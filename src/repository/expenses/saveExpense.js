import { db } from '@/localDb/db';
export function saveExpense(newExpense) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('expenses', 'readwrite');
        const objectStore = transaction.objectStore('expenses');
        const newExpenseToAdd = { ...newExpense, id: crypto.randomUUID() };
        const request = objectStore.add(newExpenseToAdd);
        request.onsuccess = () => {
            resolve(newExpenseToAdd);
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
}
