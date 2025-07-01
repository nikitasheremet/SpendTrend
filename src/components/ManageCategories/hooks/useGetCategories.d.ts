import type { Category } from '@/types/expenseData';
import { type Ref } from 'vue';
export declare function useGetCategories(): {
    categories: Ref<Category[]>;
    error: Ref<Error | undefined>;
    newCategoriesAdded: (newCategory: Category[]) => void;
    categoryDeleted: (categoryDeleted: Category) => void;
};
