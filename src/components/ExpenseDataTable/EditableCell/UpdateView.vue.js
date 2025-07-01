import { nextTick, ref } from 'vue';
import Input from '@/components/DesignSystem/Input.vue';
import DropdownWithInput from '@/components/DropdownWithInput/DropdownWithInput.vue';
const { initialValue, inputType, inputCategories } = defineProps();
const emit = defineEmits();
const updatedValue = ref(initialValue);
function clearUpdatedValue() {
    updatedValue.value = undefined;
}
function handleInputSave() {
    emit('onUpdateComplete', updatedValue.value);
    clearUpdatedValue();
}
async function handleCancelInput() {
    clearUpdatedValue();
    await nextTick();
    emit('onUpdateComplete', updatedValue.value);
}
const isInputDropdown = inputType === 'dropdown';
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.isInputDropdown) {
    /** @type {[typeof DropdownWithInput, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(DropdownWithInput, new DropdownWithInput({
        ...{ 'onBlur': {} },
        ...{ 'onEscapeKeyPressed': {} },
        autofocus: true,
        dropdownOptions: (inputCategories || []),
        modelValue: (__VLS_ctx.updatedValue),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onBlur': {} },
        ...{ 'onEscapeKeyPressed': {} },
        autofocus: true,
        dropdownOptions: (inputCategories || []),
        modelValue: (__VLS_ctx.updatedValue),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = {
        onBlur: (__VLS_ctx.handleInputSave)
    };
    const __VLS_7 = {
        onEscapeKeyPressed: (__VLS_ctx.handleCancelInput)
    };
    var __VLS_8 = {};
    var __VLS_2;
}
else {
    /** @type {[typeof Input, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(Input, new Input({
        ...{ 'onBlur': {} },
        ...{ 'onKeyup': {} },
        ...{ 'onKeyup': {} },
        autofocus: true,
        type: (inputType),
        modelValue: (__VLS_ctx.updatedValue),
        id: "new-value-input",
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onBlur': {} },
        ...{ 'onKeyup': {} },
        ...{ 'onKeyup': {} },
        autofocus: true,
        type: (inputType),
        modelValue: (__VLS_ctx.updatedValue),
        id: "new-value-input",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    let __VLS_14;
    const __VLS_15 = {
        onBlur: (__VLS_ctx.handleInputSave)
    };
    const __VLS_16 = {
        onKeyup: (__VLS_ctx.handleInputSave)
    };
    const __VLS_17 = {
        onKeyup: (__VLS_ctx.handleCancelInput)
    };
    var __VLS_18 = {};
    var __VLS_11;
}
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Input: Input,
            DropdownWithInput: DropdownWithInput,
            updatedValue: updatedValue,
            handleInputSave: handleInputSave,
            handleCancelInput: handleCancelInput,
            isInputDropdown: isInputDropdown,
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
