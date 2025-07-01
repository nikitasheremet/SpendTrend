import ExpenseDataCell from './EditableCell/ExpenseDataCell.vue';
import { useManageExpense } from './hooks/useUpdateExpense';
import { useCategoriesInExpenseData } from '@/helpers/hooks/useGetCategories';
const { expense } = defineProps();
const emits = defineEmits();
function onError(error) {
    emits('onError', error);
}
function onDeleted(deletedExpense) {
    emits('expenseDeleted', deletedExpense);
}
const { expenseData, updateExpense, deleteExpense } = useManageExpense(expense, onError, onDeleted);
const { categoryNames, getSubcategories } = useCategoriesInExpenseData();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
/** @type {[typeof ExpenseDataCell, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ExpenseDataCell, new ExpenseDataCell({
    ...{ 'onOnSave': {} },
    data: (__VLS_ctx.expenseData.date),
    type: "date",
}));
const __VLS_1 = __VLS_0({
    ...{ 'onOnSave': {} },
    data: (__VLS_ctx.expenseData.date),
    type: "date",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onOnSave: ((value) => __VLS_ctx.updateExpense(value, 'date'))
};
var __VLS_2;
/** @type {[typeof ExpenseDataCell, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(ExpenseDataCell, new ExpenseDataCell({
    ...{ 'onOnSave': {} },
    data: (__VLS_ctx.expenseData.name),
    type: "text",
}));
const __VLS_8 = __VLS_7({
    ...{ 'onOnSave': {} },
    data: (__VLS_ctx.expenseData.name),
    type: "text",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_10;
let __VLS_11;
let __VLS_12;
const __VLS_13 = {
    onOnSave: ((value) => __VLS_ctx.updateExpense(value, 'name'))
};
var __VLS_9;
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
(__VLS_ctx.expenseData.netAmount);
/** @type {[typeof ExpenseDataCell, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(ExpenseDataCell, new ExpenseDataCell({
    ...{ 'onOnSave': {} },
    data: (__VLS_ctx.expenseData.amount),
    type: "number",
}));
const __VLS_15 = __VLS_14({
    ...{ 'onOnSave': {} },
    data: (__VLS_ctx.expenseData.amount),
    type: "number",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_17;
let __VLS_18;
let __VLS_19;
const __VLS_20 = {
    onOnSave: ((value) => __VLS_ctx.updateExpense(value, 'amount'))
};
var __VLS_16;
/** @type {[typeof ExpenseDataCell, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(ExpenseDataCell, new ExpenseDataCell({
    ...{ 'onOnSave': {} },
    data: (__VLS_ctx.expenseData.paidBackAmount),
    type: "number",
}));
const __VLS_22 = __VLS_21({
    ...{ 'onOnSave': {} },
    data: (__VLS_ctx.expenseData.paidBackAmount),
    type: "number",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onOnSave: ((value) => __VLS_ctx.updateExpense(value, 'paidBackAmount'))
};
var __VLS_23;
/** @type {[typeof ExpenseDataCell, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(ExpenseDataCell, new ExpenseDataCell({
    ...{ 'onOnSave': {} },
    data: (__VLS_ctx.expenseData.category),
    type: "dropdown",
    options: (__VLS_ctx.categoryNames),
}));
const __VLS_29 = __VLS_28({
    ...{ 'onOnSave': {} },
    data: (__VLS_ctx.expenseData.category),
    type: "dropdown",
    options: (__VLS_ctx.categoryNames),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_31;
let __VLS_32;
let __VLS_33;
const __VLS_34 = {
    onOnSave: ((value) => __VLS_ctx.updateExpense(value, 'category'))
};
var __VLS_30;
/** @type {[typeof ExpenseDataCell, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(ExpenseDataCell, new ExpenseDataCell({
    ...{ 'onOnSave': {} },
    data: (__VLS_ctx.expenseData.subCategory),
    type: "dropdown",
    options: (__VLS_ctx.getSubcategories(__VLS_ctx.expenseData.category)),
}));
const __VLS_36 = __VLS_35({
    ...{ 'onOnSave': {} },
    data: (__VLS_ctx.expenseData.subCategory),
    type: "dropdown",
    options: (__VLS_ctx.getSubcategories(__VLS_ctx.expenseData.category)),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
let __VLS_38;
let __VLS_39;
let __VLS_40;
const __VLS_41 = {
    onOnSave: ((value) => __VLS_ctx.updateExpense(value, 'subCategory'))
};
var __VLS_37;
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.deleteExpense) },
    ...{ class: "delete-expense-button" },
});
/** @type {__VLS_StyleScopedClasses['delete-expense-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ExpenseDataCell: ExpenseDataCell,
            expenseData: expenseData,
            updateExpense: updateExpense,
            deleteExpense: deleteExpense,
            categoryNames: categoryNames,
            getSubcategories: getSubcategories,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
