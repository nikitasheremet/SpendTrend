import { useGetMonthlyExpenseSummary } from './helpers/useGetMonthlyExpenseSummary';
import MonthlyCategorySummaryDetails from './MonthlyCategorySummaryDetails.vue';
const monthModel = defineModel('month', { required: true });
const yearModel = defineModel('year', { required: true });
const { summaryForSelectedMonthByCategory } = useGetMonthlyExpenseSummary(monthModel, yearModel);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_defaults = {};
const __VLS_modelEmit = defineEmits();
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
for (const [category] of __VLS_getVForSourceType((Object.entries(__VLS_ctx.summaryForSelectedMonthByCategory)))) {
    /** @type {[typeof MonthlyCategorySummaryDetails, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(MonthlyCategorySummaryDetails, new MonthlyCategorySummaryDetails({
        category: (category[0]),
        monthSummaryForSelectedCategory: (category[1]),
    }));
    const __VLS_1 = __VLS_0({
        category: (category[0]),
        monthSummaryForSelectedCategory: (category[1]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MonthlyCategorySummaryDetails: MonthlyCategorySummaryDetails,
            summaryForSelectedMonthByCategory: summaryForSelectedMonthByCategory,
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
