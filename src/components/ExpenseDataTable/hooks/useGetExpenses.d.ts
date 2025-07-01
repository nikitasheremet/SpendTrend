import type { Expense } from '@/types/expenseData';
import { type Ref } from 'vue';
export declare function useGetExpenses(): {
    expenses: Ref<Expense[]>;
    expenseDeleted: (deletedExpense: Expense) => void;
    error: Ref<Error | undefined>;
};
