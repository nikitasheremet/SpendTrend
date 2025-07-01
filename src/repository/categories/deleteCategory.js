import { writeExpenseCategoriesTransaction } from '@/localDb/schema/expenseCategoriesObjectStore';
export async function deleteCategory(categoryToDelete) {
    return new Promise((resolve, reject) => {
        const categoriesObjectStore = writeExpenseCategoriesTransaction();
        const deleteRequest = categoriesObjectStore.delete(categoryToDelete.name);
        deleteRequest.onsuccess = () => {
            resolve(categoryToDelete);
        };
        deleteRequest.onerror = () => {
            reject(deleteRequest.error);
        };
    });
}
