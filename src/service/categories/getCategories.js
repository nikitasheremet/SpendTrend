import { getCategories as repoGetCategories } from '@/repository/categories/getCategories';
export async function getCategories() {
    return await repoGetCategories();
}
