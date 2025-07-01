import { ref } from 'vue';
import MonthlyCategorySummary from './MonthlyCategorySummary.vue';
import MonthlyTotalSummary from './MonthlyTotalSummary.vue';
const selectedMonth = ref(new Date().getUTCMonth());
const selectedYear = ref(new Date().getUTCFullYear());
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
/** @type {[typeof MonthlyTotalSummary, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(MonthlyTotalSummary, new MonthlyTotalSummary({
    month: (__VLS_ctx.selectedMonth),
    year: (__VLS_ctx.selectedYear),
}));
const __VLS_1 = __VLS_0({
    month: (__VLS_ctx.selectedMonth),
    year: (__VLS_ctx.selectedYear),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof MonthlyCategorySummary, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(MonthlyCategorySummary, new MonthlyCategorySummary({
    month: (__VLS_ctx.selectedMonth),
    year: (__VLS_ctx.selectedYear),
}));
const __VLS_4 = __VLS_3({
    month: (__VLS_ctx.selectedMonth),
    year: (__VLS_ctx.selectedYear),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MonthlyCategorySummary: MonthlyCategorySummary,
            MonthlyTotalSummary: MonthlyTotalSummary,
            selectedMonth: selectedMonth,
            selectedYear: selectedYear,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
