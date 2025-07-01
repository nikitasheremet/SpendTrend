import { ref } from 'vue';
import { deleteCategory as serviceDeleteCategory } from '@/service/categories/deleteCategory';
export function useDeleteCategory(category, categoryDeletedCallback) {
    const error = ref(undefined);
    async function deleteCategory() {
        let isDeleteConfirmed = window.confirm('Are you sure you want to delete this category? It will leave all expenses belonging to this category uncategorized. You will need to manually re-categorize them. This action cannot be undone.');
        if (!isDeleteConfirmed) {
            return;
        }
        try {
            await serviceDeleteCategory(category);
            categoryDeletedCallback(category);
        }
        catch (err) {
            error.value = err;
        }
    }
    return {
        deleteCategory,
        error,
    };
}
