import Modal from '../DesignSystem/Modal/Modal.vue';
import Input from '../DesignSystem/Input.vue';
import { useAddSubcategory } from './hooks/useAddSubcategory';
import Error from '../DesignSystem/Error.vue';
const isOpen = defineModel({ required: true });
const { category } = defineProps();
const emits = defineEmits();
function subcategoriesAdded(subcategories) {
    emits('subcategoriesAdded', subcategories);
}
const { newSubcategoriesValue, addSubcategory, error } = useAddSubcategory(category, subcategoriesAdded);
async function handleAddSubcategory() {
    await addSubcategory();
    closeAddSubcategoryModal();
}
function closeAddSubcategoryModal() {
    isOpen.value = false;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_defaults = {};
const __VLS_modelEmit = defineEmits();
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
/** @type {[typeof Modal, typeof Modal, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Modal, new Modal({
    ...{ 'onModalClosed': {} },
    isModalOpen: (__VLS_ctx.isOpen),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onModalClosed': {} },
    isModalOpen: (__VLS_ctx.isOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onModalClosed: (__VLS_ctx.closeAddSubcategoryModal)
};
var __VLS_7 = {};
__VLS_2.slots.default;
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(Input, new Input({
    type: "text",
    placeholder: "Subcategory name",
    modelValue: (__VLS_ctx.newSubcategoriesValue),
}));
const __VLS_9 = __VLS_8({
    type: "text",
    placeholder: "Subcategory name",
    modelValue: (__VLS_ctx.newSubcategoriesValue),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.handleAddSubcategory) },
});
if (__VLS_ctx.error) {
    /** @type {[typeof Error, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(Error, new Error({
        error: (__VLS_ctx.error),
    }));
    const __VLS_12 = __VLS_11({
        error: (__VLS_ctx.error),
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
}
var __VLS_2;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Modal: Modal,
            Input: Input,
            Error: Error,
            isOpen: isOpen,
            newSubcategoriesValue: newSubcategoriesValue,
            error: error,
            handleAddSubcategory: handleAddSubcategory,
            closeAddSubcategoryModal: closeAddSubcategoryModal,
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
