import { addNewCategories } from '@/service/categories/addNewCategories';
import { ref } from 'vue';
export function useAddCategory(addCategoryCallback) {
    const newCategoriesValue = ref('');
    const error = ref(undefined);
    async function addCategory() {
        const trimmedValue = newCategoriesValue.value.trim();
        if (trimmedValue === '') {
            error.value = new Error('Category name cannot be empty');
            return;
        }
        const newCategoryNames = newCategoriesValue.value
            .split(',')
            .map((name) => name.trim())
            .filter((name) => name.length > 0);
        try {
            const newCategories = newCategoryNames.map((name) => {
                return {
                    name,
                    subcategories: [],
                };
            });
            const newCategoriesAdded = await addNewCategories(newCategories);
            addCategoryCallback(newCategoriesAdded);
            newCategoriesValue.value = '';
        }
        catch (err) {
            error.value = err;
        }
    }
    return {
        newCategoriesValue,
        addCategory,
        error,
    };
}
