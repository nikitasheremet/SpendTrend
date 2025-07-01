import { ref, defineProps, watch } from 'vue';
import Input from '@/components/DesignSystem/Input.vue';
import DropdownOptions from './DropdownOptions.vue';
import { useDropdownOptionHandlers } from './useDropdownOptionHandlers';
const model = defineModel();
const { dropdownOptions, autofocus } = defineProps();
const emit = defineEmits();
const isEscapeKeyPressed = ref(false);
const { showCategoryOptions, hideCategoryOptions, listOfOptionsToDisplay, dropdownInputFocus, filterListBasedOnInput, } = useDropdownOptionHandlers({
    dropdownOptions,
});
watch(() => dropdownOptions, (newDropdownOptions) => {
    listOfOptionsToDisplay.value = newDropdownOptions;
});
function isInputValid(input) {
    if (!input) {
        return true;
    }
    return Boolean(dropdownOptions.find((dropdownOption) => dropdownOption === input));
}
function handleInput(event) {
    const targetValue = event.target.value;
    emit('onChange', targetValue);
    emit('isInputValid', isInputValid(targetValue));
    filterListBasedOnInput(targetValue);
}
function setInput(valueSelected) {
    model.value = valueSelected;
    hideCategoryOptions();
}
function blurInput(event, isEscapeKey) {
    isEscapeKeyPressed.value = Boolean(isEscapeKey);
    event.target.blur();
}
function handleInputBlur(event) {
    const eventTarget = event.target;
    const eventRelatedTarget = event.relatedTarget;
    // If no relatedTarget, or the relatedTarget it not the parent element class name then the blur happned because of an interaction with an
    // element external to this component
    const isBlurOutsideDropdownInput = !eventRelatedTarget || eventRelatedTarget.className !== 'dropdown-input';
    if (isBlurOutsideDropdownInput) {
        eventTarget.parentNode?.dispatchEvent(new Event('blur'));
        if (isEscapeKeyPressed.value) {
            emit('escapeKeyPressed');
            isEscapeKeyPressed.value = false;
        }
        else {
            emit('blur');
        }
    }
    else {
        eventTarget.focus();
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_defaults = {};
const __VLS_modelEmit = defineEmits();
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onBlur: (__VLS_ctx.hideCategoryOptions) },
    ...{ class: "dropdown-input" },
    tabindex: "-1",
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Input, new Input({
    ...{ 'onInput': {} },
    ...{ 'onFocus': {} },
    ...{ 'onBlur': {} },
    ...{ 'onKeyup': {} },
    ...{ 'onKeyup': {} },
    autofocus: (autofocus),
    modelValue: (__VLS_ctx.model),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onInput': {} },
    ...{ 'onFocus': {} },
    ...{ 'onBlur': {} },
    ...{ 'onKeyup': {} },
    ...{ 'onKeyup': {} },
    autofocus: (autofocus),
    modelValue: (__VLS_ctx.model),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onInput: (__VLS_ctx.handleInput)
};
const __VLS_7 = {
    onFocus: (__VLS_ctx.showCategoryOptions)
};
const __VLS_8 = {
    onBlur: (__VLS_ctx.handleInputBlur)
};
const __VLS_9 = {
    onKeyup: (__VLS_ctx.blurInput)
};
const __VLS_10 = {
    onKeyup: ((e) => __VLS_ctx.blurInput(e, true))
};
var __VLS_2;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "options" },
});
if (__VLS_ctx.dropdownInputFocus) {
    /** @type {[typeof DropdownOptions, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(DropdownOptions, new DropdownOptions({
        ...{ 'onDropdownOptionClick': {} },
        options: (__VLS_ctx.listOfOptionsToDisplay),
    }));
    const __VLS_12 = __VLS_11({
        ...{ 'onDropdownOptionClick': {} },
        options: (__VLS_ctx.listOfOptionsToDisplay),
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    let __VLS_14;
    let __VLS_15;
    let __VLS_16;
    const __VLS_17 = {
        onDropdownOptionClick: (__VLS_ctx.setInput)
    };
    var __VLS_13;
}
/** @type {__VLS_StyleScopedClasses['dropdown-input']} */ ;
/** @type {__VLS_StyleScopedClasses['options']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Input: Input,
            DropdownOptions: DropdownOptions,
            model: model,
            showCategoryOptions: showCategoryOptions,
            hideCategoryOptions: hideCategoryOptions,
            listOfOptionsToDisplay: listOfOptionsToDisplay,
            dropdownInputFocus: dropdownInputFocus,
            handleInput: handleInput,
            setInput: setInput,
            blurInput: blurInput,
            handleInputBlur: handleInputBlur,
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
