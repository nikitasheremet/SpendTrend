import { ref } from 'vue';
import { updateExpense as serviceUpdateExpense } from '@/service/expenses/updateExpense';
import { deleteExpense as serviceDeleteExpense } from '@/service/expenses/deleteExpense';
export function useManageExpense(expense, onErrorCallback, onExpenseDeletedCallback) {
    const expenseData = ref(expense);
    async function updateExpense(newValue, key) {
        try {
            const updatedExpense = { ...expenseData.value, [key]: newValue };
            await serviceUpdateExpense(updatedExpense);
            expenseData.value = updatedExpense;
        }
        catch (err) {
            onErrorCallback(err);
        }
    }
    async function deleteExpense() {
        try {
            await serviceDeleteExpense(expenseData.value.id);
            onExpenseDeletedCallback(expenseData.value);
        }
        catch (err) {
            onErrorCallback(err);
        }
    }
    return {
        expenseData,
        updateExpense,
        deleteExpense,
    };
}
