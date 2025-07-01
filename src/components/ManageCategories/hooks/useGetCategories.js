import { getCategories } from '@/service/categories/getCategories';
import { onMounted, ref } from 'vue';
export function useGetCategories() {
    const categories = ref([]);
    const error = ref(undefined);
    async function fetchCategories() {
        try {
            getCategories().then((response) => {
                categories.value = response;
            });
        }
        catch (err) {
            error.value = err;
        }
    }
    onMounted(() => {
        fetchCategories();
    });
    function newCategoriesAdded(newCategories) {
        const updatedCategories = [...categories.value, ...newCategories].sort((a, b) => a.name.localeCompare(b.name));
        categories.value = updatedCategories;
    }
    function categoryDeleted(categoryDeleted) {
        categories.value = categories.value.filter((category) => category.name !== categoryDeleted.name);
    }
    return {
        categories,
        error,
        newCategoriesAdded,
        categoryDeleted,
    };
}
