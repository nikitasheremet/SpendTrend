import type { Category } from '@/types/expenseData'

export async function deleteCategory(categoryToDelete: Category): Promise<Category> {
  return categoryToDelete
}
