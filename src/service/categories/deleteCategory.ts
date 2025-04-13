import type { Category } from '@/types/expenseData'
import { deleteCategory as repoDeleteCategory } from '@/repository/categories/deleteCategory'

export async function deleteCategory(categoryToDelete: Category): Promise<Category> {
  return await repoDeleteCategory(categoryToDelete)
}
