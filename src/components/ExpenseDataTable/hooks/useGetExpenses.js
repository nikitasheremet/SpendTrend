import { getAllExpenses } from '@/service/expenses/getAllExpenses';
import { onMounted, ref } from 'vue';
export function useGetExpenses() {
    const expenses = ref([]);
    const error = ref(undefined);
    onMounted(() => {
        try {
            getAllExpenses().then((data) => {
                expenses.value = data;
            });
        }
        catch (err) {
            error.value = err;
        }
    });
    const expenseDeleted = (deletedExpense) => {
        const expensesWithoutDeletedExpense = expenses.value.filter((expense) => expense.id !== deletedExpense.id);
        expenses.value = expensesWithoutDeletedExpense;
    };
    return {
        expenses,
        expenseDeleted,
        error,
    };
}
