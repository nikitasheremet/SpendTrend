import { addCategories } from '@/repository/categories/addCategories';
export async function addNewCategories(newCategories) {
    return await addCategories(newCategories);
}
