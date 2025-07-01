import type { NewExpense } from '@/types/expenseData';
export declare function addNewExpense<T = NewExpense>(newExpenseData: T): Promise<T>;
