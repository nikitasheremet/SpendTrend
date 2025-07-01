import { editCategory } from '@/repository/categories/editCategory';
import { getCategories } from '@/repository/categories/getCategories';
export async function deleteSubcategory(category, subcategoryToDelete) {
    const upToDateCategory = await getCategory(category.name);
    const newSubcategories = upToDateCategory.subcategories.filter((subcategory) => subcategory !== subcategoryToDelete);
    const newCategory = {
        ...category,
        subcategories: newSubcategories,
    };
    return await editCategory(newCategory);
}
async function getCategory(categoryName) {
    const categories = await getCategories();
    const category = categories.find((category) => category.name === categoryName);
    if (!category) {
        throw new Error(`Category ${categoryName} not found`);
    }
    return category;
}
