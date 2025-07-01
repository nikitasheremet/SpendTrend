import Modal from '../DesignSystem/Modal/Modal.vue';
import { computed } from 'vue';
import { useControlModal } from '../DesignSystem/Modal/useControlModal';
import { useAddCategory } from './hooks/useAddCategory';
import Error from '../DesignSystem/Error.vue';
const { isModalOpen: isAddCategoryModalOpen, openModal, closeModal } = useControlModal();
const emits = defineEmits();
function newCategoryAdded(newCategory) {
    emits('categoryAdded', newCategory);
    closeModal();
}
const { newCategoriesValue, addCategory, error } = useAddCategory(newCategoryAdded);
const isSaveCategoryDisabled = computed(() => Boolean(!newCategoriesValue.value));
function handleAddCategory() {
    openModal();
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.handleAddCategory) },
});
/** @type {[typeof Modal, typeof Modal, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Modal, new Modal({
    ...{ 'onModalClosed': {} },
    isModalOpen: (__VLS_ctx.isAddCategoryModalOpen),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onModalClosed': {} },
    isModalOpen: (__VLS_ctx.isAddCategoryModalOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onModalClosed: (__VLS_ctx.closeModal)
};
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    id: "add-category-input",
    type: "text",
    placeholder: "Multiple categories can be added seperated by commas",
    value: (__VLS_ctx.newCategoriesValue),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.addCategory) },
    disabled: (__VLS_ctx.isSaveCategoryDisabled),
});
if (__VLS_ctx.error) {
    /** @type {[typeof Error, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(Error, new Error({
        error: (__VLS_ctx.error),
    }));
    const __VLS_8 = __VLS_7({
        error: (__VLS_ctx.error),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
}
var __VLS_2;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Modal: Modal,
            Error: Error,
            isAddCategoryModalOpen: isAddCategoryModalOpen,
            closeModal: closeModal,
            newCategoriesValue: newCategoriesValue,
            addCategory: addCategory,
            error: error,
            isSaveCategoryDisabled: isSaveCategoryDisabled,
            handleAddCategory: handleAddCategory,
        };
    },
    __typeEmits: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
});
; /* PartiallyEnd: #4569/main.vue */
