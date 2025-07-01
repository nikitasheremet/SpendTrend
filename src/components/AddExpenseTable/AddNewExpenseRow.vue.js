import AddExpenseCell from './AddExpenseCell.vue';
import { useCategoriesInExpenseData } from '@/helpers/hooks/useGetCategories';
const newExpenseData = defineModel({ required: true });
const { categoryNames, getSubcategories } = useCategoriesInExpenseData();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_defaults = {};
const __VLS_modelEmit = defineEmits();
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
/** @type {[typeof AddExpenseCell, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AddExpenseCell, new AddExpenseCell({
    type: "date",
    modelValue: (__VLS_ctx.newExpenseData.date),
}));
const __VLS_1 = __VLS_0({
    type: "date",
    modelValue: (__VLS_ctx.newExpenseData.date),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof AddExpenseCell, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(AddExpenseCell, new AddExpenseCell({
    modelValue: (__VLS_ctx.newExpenseData.name),
}));
const __VLS_4 = __VLS_3({
    modelValue: (__VLS_ctx.newExpenseData.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
(__VLS_ctx.newExpenseData.netAmount);
/** @type {[typeof AddExpenseCell, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(AddExpenseCell, new AddExpenseCell({
    type: "number",
    modelValue: (__VLS_ctx.newExpenseData.amount),
}));
const __VLS_7 = __VLS_6({
    type: "number",
    modelValue: (__VLS_ctx.newExpenseData.amount),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
/** @type {[typeof AddExpenseCell, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(AddExpenseCell, new AddExpenseCell({
    type: "number",
    modelValue: (__VLS_ctx.newExpenseData.paidBackAmount),
}));
const __VLS_10 = __VLS_9({
    type: "number",
    modelValue: (__VLS_ctx.newExpenseData.paidBackAmount),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {[typeof AddExpenseCell, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(AddExpenseCell, new AddExpenseCell({
    type: "dropdown",
    modelValue: (__VLS_ctx.newExpenseData.category),
    dropdownOptions: (__VLS_ctx.categoryNames),
}));
const __VLS_13 = __VLS_12({
    type: "dropdown",
    modelValue: (__VLS_ctx.newExpenseData.category),
    dropdownOptions: (__VLS_ctx.categoryNames),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
/** @type {[typeof AddExpenseCell, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(AddExpenseCell, new AddExpenseCell({
    type: "dropdown",
    modelValue: (__VLS_ctx.newExpenseData.subCategory),
    dropdownOptions: (__VLS_ctx.getSubcategories(__VLS_ctx.newExpenseData.category)),
}));
const __VLS_16 = __VLS_15({
    type: "dropdown",
    modelValue: (__VLS_ctx.newExpenseData.subCategory),
    dropdownOptions: (__VLS_ctx.getSubcategories(__VLS_ctx.newExpenseData.category)),
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AddExpenseCell: AddExpenseCell,
            newExpenseData: newExpenseData,
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
