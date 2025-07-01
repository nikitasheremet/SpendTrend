import { ref, watchEffect } from 'vue';
import { addNewExpense } from '@/service/expenses/addNewExpense';
function createNewEmptyExpenseData() {
    return {
        date: new Date().getTime(),
        name: '',
        netAmount: 0,
        amount: 0,
        paidBackAmount: 0,
        category: '',
        subCategory: '',
    };
}
export function useAddExpense() {
    const newExpenseData = ref(createNewEmptyExpenseData());
    const error = ref(undefined);
    watchEffect(() => {
        const { amount, paidBackAmount } = newExpenseData.value;
        newExpenseData.value.netAmount = (amount || 0) - (paidBackAmount || 0);
    });
    async function addExpense() {
        try {
            verifyNewExpenseData(newExpenseData.value);
            await addNewExpense(newExpenseData.value);
            newExpenseData.value = createNewEmptyExpenseData();
        }
        catch (err) {
            error.value = err;
        }
    }
    return {
        newExpenseData,
        addExpense,
        error,
    };
}
function verifyNewExpenseData(newExpenseData) {
    if (!newExpenseData.date) {
        throw new Error('Date is required');
    }
}
