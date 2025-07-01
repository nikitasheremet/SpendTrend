import type { Expense } from '@/types/expenseData';
import { type Ref } from 'vue';
export declare function useManageExpense(expense: Expense, onErrorCallback: (error: Error) => void, onExpenseDeletedCallback: (deletedExpense: Expense) => void): {
    expenseData: Ref<Expense>;
    updateExpense: (newValue: any, key: keyof Expense) => Promise<void>;
    deleteExpense: () => Promise<void>;
};
