import MonthlySubcategorySummary from './MonthlySubcategorySummary.vue';
import { ref } from 'vue';
const { category, monthSummaryForSelectedCategory } = defineProps();
const isSubcategoryDetailsShown = ref(false);
function showSubcategories() {
    isSubcategoryDetailsShown.value = !isSubcategoryDetailsShown.value;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
    ...{ onClick: (__VLS_ctx.showSubcategories) },
});
(category);
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
(monthSummaryForSelectedCategory.totalAmount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
(monthSummaryForSelectedCategory.threeMonthAverage);
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
(monthSummaryForSelectedCategory.diffTotalToAverage);
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
(monthSummaryForSelectedCategory.diffTotalToAverageAsPercent);
if (__VLS_ctx.isSubcategoryDetailsShown) {
    /** @type {[typeof MonthlySubcategorySummary, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(MonthlySubcategorySummary, new MonthlySubcategorySummary({
        summaryForSelectedMonthBySubcategory: (monthSummaryForSelectedCategory.subcategories),
    }));
    const __VLS_1 = __VLS_0({
        summaryForSelectedMonthBySubcategory: (monthSummaryForSelectedCategory.subcategories),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MonthlySubcategorySummary: MonthlySubcategorySummary,
            isSubcategoryDetailsShown: isSubcategoryDetailsShown,
            showSubcategories: showSubcategories,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
