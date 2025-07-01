import type { Category } from '@/types/expenseData';
import { type ComputedRef, type Ref } from 'vue';
export declare function useCategoriesInExpenseData(): {
    categories: Ref<Category[]>;
    categoryNames: ComputedRef<string[]>;
    getSubcategories: (categoryName?: string) => string[];
};
