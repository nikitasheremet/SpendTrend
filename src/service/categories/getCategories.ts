import { getCategories as repoGetCategories } from '@/repository/categories/getCategories'
import type { Category } from '@/types/expenseData'

export async function getCategories(): Promise<Category[]> {
  return await repoGetCategories()
}
