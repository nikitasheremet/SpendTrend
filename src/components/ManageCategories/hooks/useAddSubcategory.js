import { splitString } from '@/helpers/splitString';
import { addNewSubcategories } from '@/service/categories/addNewSubcategories';
import { ref } from 'vue';
export function useAddSubcategory(category, subcategoryAddedCallback) {
    const newSubcategoriesValue = ref('');
    const error = ref(undefined);
    async function addSubcategory() {
        try {
            const newSubcategories = splitString(newSubcategoriesValue.value);
            if (!newSubcategories) {
                throw new Error('Subcategory name cannot be empty');
            }
            const orderedSubcategories = newSubcategories.sort((a, b) => a.localeCompare(b));
            await addNewSubcategories(category, orderedSubcategories);
            subcategoryAddedCallback(newSubcategories);
        }
        catch (err) {
            error.value = err;
        }
    }
    return {
        newSubcategoriesValue,
        addSubcategory,
        error,
    };
}
