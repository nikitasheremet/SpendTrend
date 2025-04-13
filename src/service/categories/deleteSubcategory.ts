import { editCategory } from '@/repository/categories/editCategory'
import { getCategories } from '@/repository/categories/getCategories'
import type { Category } from '@/types/expenseData'

export async function deleteSubcategory(
  category: Category,
  subcategoryToDelete: string,
): Promise<Category> {
  const upToDateCategory = await getCategory(category.name)
  const newSubcategories = upToDateCategory.subcategories.filter(
    (subcategory) => subcategory !== subcategoryToDelete,
  )
  const newCategory = {
    ...category,
    subcategories: newSubcategories,
  }
  return await editCategory(newCategory as Category)
}

async function getCategory(categoryName: string): Promise<Category> {
  const categories = await getCategories()
  const category = categories.find((category) => category.name === categoryName)
  if (!category) {
    throw new Error(`Category ${categoryName} not found`)
  }
  return category
}
