import type { Expense } from '@/types/expenseData';
export declare function getExpensesForDateRange(dateRange: [number, number], filters?: {
    category?: string;
    subcategory?: string;
}, options?: {
    inclusive: boolean;
}): Promise<Expense[]>;
