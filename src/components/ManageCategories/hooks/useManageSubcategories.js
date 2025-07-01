import { ref } from 'vue';
import { deleteSubcategory as serviceDeleteSubcategory } from '@/service/categories/deleteSubcategory';
export function useManageSubcategories(category) {
    const subcategories = ref(category.subcategories);
    const error = ref(undefined);
    const subcategoriesAdded = (newSubcategories) => {
        subcategories.value = [...subcategories.value, ...newSubcategories];
    };
    const deleteSubcategory = async (subcategoryToDelete) => {
        let isDeleteConfirmed = window.confirm('Are you sure you want to delete this subcategory? It will remove this subcategory from all expenses. You will need to manually re-categorize them if desired. This action cannot be undone.');
        if (!isDeleteConfirmed) {
            return;
        }
        try {
            await serviceDeleteSubcategory(category, subcategoryToDelete);
            subcategories.value = subcategories.value.filter((subcategory) => subcategory !== subcategoryToDelete);
        }
        catch (err) {
            error.value = err;
        }
    };
    return {
        subcategories,
        subcategoriesAdded,
        deleteSubcategory,
        error,
    };
}
