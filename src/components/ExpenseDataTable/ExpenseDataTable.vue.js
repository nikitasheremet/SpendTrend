import ExpenseDataTableHead from '../ExpenseDataTableHead.vue';
import { useGetExpenses } from './hooks/useGetExpenses';
import Error from '../DesignSystem/Error.vue';
import ExpenseRow from './ExpenseRow.vue';
const { expenses, error, expenseDeleted } = useGetExpenses();
function handleRowError(newError) {
    error.value = newError;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({});
/** @type {[typeof ExpenseDataTableHead, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ExpenseDataTableHead, new ExpenseDataTableHead({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
for (const [expense] of __VLS_getVForSourceType((__VLS_ctx.expenses))) {
    /** @type {[typeof ExpenseRow, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(ExpenseRow, new ExpenseRow({
        ...{ 'onExpenseDeleted': {} },
        ...{ 'onOnError': {} },
        expense: (expense),
    }));
    const __VLS_4 = __VLS_3({
        ...{ 'onExpenseDeleted': {} },
        ...{ 'onOnError': {} },
        expense: (expense),
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
    let __VLS_6;
    let __VLS_7;
    let __VLS_8;
    const __VLS_9 = {
        onExpenseDeleted: (__VLS_ctx.expenseDeleted)
    };
    const __VLS_10 = {
        onOnError: (__VLS_ctx.handleRowError)
    };
    var __VLS_5;
}
if (__VLS_ctx.error) {
    /** @type {[typeof Error, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(Error, new Error({
        error: (__VLS_ctx.error),
    }));
    const __VLS_12 = __VLS_11({
        error: (__VLS_ctx.error),
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
}
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ExpenseDataTableHead: ExpenseDataTableHead,
            Error: Error,
            ExpenseRow: ExpenseRow,
            expenses: expenses,
            error: error,
            expenseDeleted: expenseDeleted,
            handleRowError: handleRowError,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
