import { editCategory } from '@/repository/categories/editCategory';
export async function addNewSubcategories(category, newSubcategories) {
    const newCategory = {
        ...category,
        subcategories: [...category.subcategories, ...newSubcategories],
    };
    return await editCategory(newCategory);
}
