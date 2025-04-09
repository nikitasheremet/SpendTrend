import { editCategory } from '@/repository/categories/editCategory'
import type { Category } from '@/types/expenseData'

export async function deleteSubcategory(
  category: Category,
  subcategoryToDelete: string,
): Promise<Category> {
  const newSubcategories = category.subcategories.filter(
    (subcategory) => subcategory !== subcategoryToDelete,
  )
  const newCategory = {
    ...category,
    subcategories: newSubcategories,
  }
  return await editCategory(newCategory as Category)
}
