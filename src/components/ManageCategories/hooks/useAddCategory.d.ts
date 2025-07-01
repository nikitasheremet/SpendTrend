import type { Category } from '@/types/expenseData';
import { type Ref } from 'vue';
export declare function useAddCategory(addCategoryCallback: (newCategoriesAdded: Category[]) => void): {
    newCategoriesValue: Ref<string>;
    addCategory: () => void;
    error: Ref<Error | undefined>;
};
