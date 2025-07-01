import type { NewExpense } from '@/types/expenseData';
export declare function saveExpense<T = NewExpense>(newExpense: T): Promise<T>;
