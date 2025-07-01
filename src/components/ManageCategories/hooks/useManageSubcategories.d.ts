import type { Category } from '@/types/expenseData';
import { type Ref } from 'vue';
export declare function useManageSubcategories(category: Category): {
    subcategories: Ref<string[]>;
    subcategoriesAdded: (newSubcategory: string[]) => void;
    deleteSubcategory: (subcategoryToDelete: string) => Promise<void>;
    error: Ref<Error | undefined>;
};
