import { addCategories } from '@/repository/categories/addCategories'
import type { Category } from '@/types/expenseData'

export async function addNewCategories(newCategories: Category[]): Promise<Category[]> {
  return await addCategories(newCategories)
}
