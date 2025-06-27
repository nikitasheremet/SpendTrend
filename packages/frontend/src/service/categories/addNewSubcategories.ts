import { editCategory } from '@/repository/categories/editCategory'
import type { Category } from '@/types/expenseData'

export async function addNewSubcategories(
  category: Category,
  newSubcategories: string[],
): Promise<Category> {
  const newCategory = {
    ...category,
    subcategories: [...category.subcategories, ...newSubcategories],
  }
  return await editCategory(newCategory)
}
