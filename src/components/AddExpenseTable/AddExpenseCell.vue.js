import Input from '@/components/DesignSystem/Input.vue';
import DropdownWithInput from '../DropdownWithInput/DropdownWithInput.vue';
import { computed } from 'vue';
const model = defineModel();
const { type = 'string', dropdownOptions = [] } = defineProps();
const dropdownModel = computed({
    get() {
        return model.value;
    },
    set(value) {
        model.value = value;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
if (type === 'dropdown') {
    /** @type {[typeof DropdownWithInput, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(DropdownWithInput, new DropdownWithInput({
        dropdownOptions: (dropdownOptions),
        modelValue: (__VLS_ctx.dropdownModel),
    }));
    const __VLS_1 = __VLS_0({
        dropdownOptions: (dropdownOptions),
        modelValue: (__VLS_ctx.dropdownModel),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
else {
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(Input, new Input({
        type: (type),
        modelValue: (__VLS_ctx.model),
    }));
    const __VLS_4 = __VLS_3({
        type: (type),
        modelValue: (__VLS_ctx.model),
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
}
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Input: Input,
            DropdownWithInput: DropdownWithInput,
            model: model,
            dropdownModel: dropdownModel,
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
