import { onMounted, ref } from 'vue';
import { useGetMonthlyExpenseSummary } from './helpers/useGetMonthlyExpenseSummary';
import { getListOfYears } from '@/service/expenses/getListOfYears';
const monthModel = defineModel('month', { required: true });
const yearModel = defineModel('year', { required: true });
const listOfYears = ref([]);
onMounted(() => {
    getListOfYears().then((years) => {
        const currentYear = new Date().getUTCFullYear();
        const yearsWithCurrentYear = Array.from(new Set([...years, currentYear].sort((a, b) => a - b)));
        listOfYears.value = yearsWithCurrentYear;
    });
});
const listOfMonths = [
    ['Jan', 0],
    ['Feb', 1],
    ['Mar', 2],
    ['Apr', 3],
    ['May', 4],
    ['Jun', 5],
    ['Jul', 6],
    ['Aug', 7],
    ['Sep', 8],
    ['Oct', 9],
    ['Nov', 10],
    ['Dec', 11],
];
const { summaryForSelectedMonth } = useGetMonthlyExpenseSummary(monthModel, yearModel);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_defaults = {};
const __VLS_modelEmit = defineEmits();
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    id: "monthly-summary-grid",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.yearModel),
});
for (const [year] of __VLS_getVForSourceType((__VLS_ctx.listOfYears))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: (year),
    });
    (year);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.monthModel),
});
for (const [month] of __VLS_getVForSourceType((__VLS_ctx.listOfMonths))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: (month[1]),
    });
    (month[0]);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
(__VLS_ctx.summaryForSelectedMonth.totalAmount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
(__VLS_ctx.summaryForSelectedMonth.threeMonthAverage);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
(__VLS_ctx.summaryForSelectedMonth.diffTotalToAverage);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
(__VLS_ctx.summaryForSelectedMonth.diffTotalToAverageAsPercent);
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            monthModel: monthModel,
            yearModel: yearModel,
            listOfYears: listOfYears,
            listOfMonths: listOfMonths,
            summaryForSelectedMonth: summaryForSelectedMonth,
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
