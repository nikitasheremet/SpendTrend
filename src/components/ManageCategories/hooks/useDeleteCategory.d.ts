import type { Category } from '@/types/expenseData';
import { type Ref } from 'vue';
export declare function useDeleteCategory(category: Category, categoryDeletedCallback: (categoryDeleted: Category) => void): {
    deleteCategory: () => Promise<void>;
    error: Ref<Error | undefined>;
};
