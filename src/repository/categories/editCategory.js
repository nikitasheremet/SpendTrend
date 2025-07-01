import { writeExpenseCategoriesTransaction } from '@/localDb/schema/expenseCategoriesObjectStore';
export async function editCategory(newCategory) {
    return new Promise((resolve, reject) => {
        const categoriesObjectStore = writeExpenseCategoriesTransaction();
        const updateRequest = categoriesObjectStore.put(newCategory);
        updateRequest.onsuccess = () => {
            resolve(newCategory);
        };
        updateRequest.onerror = () => {
            reject(updateRequest.error);
        };
    });
}
