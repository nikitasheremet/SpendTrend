import { getCategories } from '@/service/categories/getCategories';
import { computed, onMounted, ref } from 'vue';
export function useCategoriesInExpenseData() {
    const categories = ref([]);
    onMounted(() => {
        getCategories().then((response) => {
            categories.value = response;
        });
    });
    const categoryNames = computed(() => {
        return categories.value.map((category) => category.name);
    });
    function getSubcategories(categoryName) {
        const selectedCategoryObject = categories.value.find((category) => category.name === categoryName);
        if (selectedCategoryObject) {
            return selectedCategoryObject.subcategories;
        }
        return [];
    }
    return {
        categories,
        categoryNames,
        getSubcategories,
    };
}
