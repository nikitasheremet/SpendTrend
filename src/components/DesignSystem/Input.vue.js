import { DateFormat, formatDate } from '@/helpers/date/formateDate';
import { computed, onMounted, useTemplateRef } from 'vue';
const { autofocus, type = 'string' } = defineProps();
const model = defineModel();
const inputRef = useTemplateRef(__VLS_placeholder);
onMounted(() => {
    if (autofocus) {
        inputRef.value?.focus();
    }
});
const transformedModel = computed({
    get() {
        if (type === 'date' && model.value) {
            return formatDate(new Date(model.value), DateFormat.YYYY_MM_DD);
        }
        return model.value;
    },
    set(value) {
        if (type === 'date' && value) {
            model.value = new Date(value).getTime();
        }
        else {
            model.value = value;
        }
    },
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_defaults = {};
const __VLS_modelEmit = defineEmits();
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ref: "input-ref",
    type: (type),
});
(__VLS_ctx.transformedModel);
/** @type {typeof __VLS_ctx['input-ref']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            transformedModel: transformedModel,
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
