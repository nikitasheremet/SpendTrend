import { deleteCategory as repoDeleteCategory } from '@/repository/categories/deleteCategory';
export async function deleteCategory(categoryToDelete) {
    return await repoDeleteCategory(categoryToDelete);
}
