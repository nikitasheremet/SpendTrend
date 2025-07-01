import type { Expense, NewExpense } from '@/types/expenseData';
export declare const store: {
    getAllExpenses: (order?: "asc" | "desc") => Promise<Expense[]>;
    getExpensesForDateRange: (dateRange: [number, number], filters?: {
        category?: string;
        subcategory?: string;
    }, options?: {
        inclusive: boolean;
    }) => Promise<Expense[]>;
    addExpense: (newExpense: NewExpense) => Promise<Expense[]>;
    updateExpense: (expenseDataToUpdate: Partial<Expense>, key: string) => Promise<void>;
    addCategories: (newCategories: string[]) => string[];
    addSubcategoriesToCategory: (newSubcategories: string[], categoryToAddTo: string) => string[];
    getCategories: () => string[];
    getSubcategories: () => string[];
    getSubcategoriesForCategory: (category: string) => string[];
    deleteCategory: (categoryToDelete: string) => void;
    deleteSubcategory: (subcategoryToDelete: string, category: string) => void;
    deleteExpense: (key: string) => Promise<void>;
};
