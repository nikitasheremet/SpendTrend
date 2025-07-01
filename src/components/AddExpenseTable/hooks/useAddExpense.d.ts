import { type Ref } from 'vue';
import type { NewExpenseData } from '../AddExpenseTable.vue';
export declare function useAddExpense(): {
    newExpenseData: Ref<NewExpenseData>;
    addExpense: () => Promise<void>;
    error: Ref<Error | undefined>;
};
