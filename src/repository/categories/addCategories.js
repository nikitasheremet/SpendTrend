import { writeExpenseCategoriesTransaction } from '@/localDb/schema/expenseCategoriesObjectStore';
export async function addCategories(newCategories) {
    return new Promise(async (resolve, reject) => {
        const categoriesObjectStore = writeExpenseCategoriesTransaction();
        try {
            await Promise.all(newCategories.map((category) => {
                return new Promise((resolve, reject) => {
                    const addCategoryRequest = categoriesObjectStore.add(category);
                    addCategoryRequest.onsuccess = () => {
                        resolve();
                    };
                    addCategoryRequest.onerror = () => {
                        reject(addCategoryRequest.error);
                    };
                });
            }));
            resolve(newCategories);
        }
        catch (err) {
            reject(err);
        }
    });
}
