import { ref } from 'vue';
import UpdateView from './UpdateView.vue';
import { DateFormat, formatDate } from '@/helpers/date/formateDate';
const { data, options, type = 'text' } = defineProps();
const emit = defineEmits();
function onSave(value) {
    emit('onSave', value);
}
const isEditMode = ref(false);
async function turnOnEditMode() {
    if (!isEditMode.value) {
        isEditMode.value = true;
    }
}
function turnOffEditMode() {
    isEditMode.value = false;
}
function handleUpdateComplete(value) {
    if (value) {
        onSave(value);
    }
    turnOffEditMode();
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
    ...{ onClick: (__VLS_ctx.turnOnEditMode) },
    ...{ class: ({ editModeOn: __VLS_ctx.isEditMode }) },
});
if (__VLS_ctx.isEditMode) {
    /** @type {[typeof UpdateView, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(UpdateView, new UpdateView({
        ...{ 'onOnUpdateComplete': {} },
        initialValue: (data),
        inputType: (type),
        inputCategories: (options),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onOnUpdateComplete': {} },
        initialValue: (data),
        inputType: (type),
        inputCategories: (options),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = {
        onOnUpdateComplete: (__VLS_ctx.handleUpdateComplete)
    };
    var __VLS_2;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (type === 'date' ? __VLS_ctx.formatDate(data, __VLS_ctx.DateFormat.DD_MMMM_YYYY) : data);
}
/** @type {__VLS_StyleScopedClasses['editModeOn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            UpdateView: UpdateView,
            DateFormat: DateFormat,
            formatDate: formatDate,
            isEditMode: isEditMode,
            turnOnEditMode: turnOnEditMode,
            handleUpdateComplete: handleUpdateComplete,
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
