import ExpenseDataTableHead from '../ExpenseDataTableHead.vue';
import AddNewExpenseRow from './AddNewExpenseRow.vue';
import { useAddExpense } from './hooks/useAddExpense';
import Error from '../DesignSystem/Error.vue';
const { newExpenseData, addExpense, error } = useAddExpense();
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
/** @type {[typeof AddNewExpenseRow, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(AddNewExpenseRow, new AddNewExpenseRow({
    modelValue: (__VLS_ctx.newExpenseData),
}));
const __VLS_4 = __VLS_3({
    modelValue: (__VLS_ctx.newExpenseData),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.addExpense) },
});
if (__VLS_ctx.error) {
    /** @type {[typeof Error, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(Error, new Error({
        error: (__VLS_ctx.error),
    }));
    const __VLS_7 = __VLS_6({
        error: (__VLS_ctx.error),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
}
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ExpenseDataTableHead: ExpenseDataTableHead,
            AddNewExpenseRow: AddNewExpenseRow,
            Error: Error,
            newExpenseData: newExpenseData,
            addExpense: addExpense,
            error: error,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
