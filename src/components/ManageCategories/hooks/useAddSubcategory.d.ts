import type { Category } from '@/types/expenseData';
import { type Ref } from 'vue';
export declare function useAddSubcategory(category: Category, subcategoryAddedCallback: (newSubcategories: string[]) => void): {
    newSubcategoriesValue: Ref<string>;
    addSubcategory: () => Promise<void>;
    error: Ref<Error | undefined>;
};
