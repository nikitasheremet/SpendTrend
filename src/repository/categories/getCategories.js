import { readExpenseCategoriesTransaction, } from '@/localDb/schema/expenseCategoriesObjectStore';
export async function getCategories() {
    return new Promise((resolve, reject) => {
        const categoriesObjectStore = readExpenseCategoriesTransaction();
        const getCategoriesRequest = categoriesObjectStore.getAll();
        getCategoriesRequest.onsuccess = () => {
            const categories = getCategoriesRequest.result;
            resolve(mapDbCategoriesToCategories(categories));
        };
        getCategoriesRequest.onerror = () => {
            reject(getCategoriesRequest.error);
        };
    });
}
function mapDbCategoriesToCategories(dbCategories) {
    return dbCategories.map((category) => mapDbCategoryToCategory(category));
}
function mapDbCategoryToCategory(dbCategory) {
    return {
        name: dbCategory.name,
        subcategories: dbCategory.subcategories,
    };
}
