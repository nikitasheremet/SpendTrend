import { ref } from 'vue';
import AddSubcategoryModal from '@/components/ManageCategories/AddSubcategoryModal.vue';
import { useDeleteCategory } from './hooks/useDeleteCategory';
import SubcategoryView from './SubcategoryView.vue';
import { useManageSubcategories } from './hooks/useManageSubcategories';
import { useControlModal } from '../DesignSystem/Modal/useControlModal';
import { useControlCategoryOptions } from './hooks/useControlCategoryOptions';
import Error from '../DesignSystem/Error.vue';
const { category } = defineProps();
const emits = defineEmits();
function categoryDeleted() {
    emits('categoryDeleted', category);
}
const { deleteCategory, error: deleteCategoryError } = useDeleteCategory(category, categoryDeleted);
const { subcategories, deleteSubcategory, subcategoriesAdded, error: deleteSubcategoryError, } = useManageSubcategories(category);
const { isModalOpen: isAddSubcategoryModalOpen, openModal: openAddSubcategoryModal } = useControlModal();
const { isOptionsOpen, toggleOptions, closeOptions } = useControlCategoryOptions();
const showSubcategories = ref(false);
function handleCategoryClick() {
    showSubcategories.value = !showSubcategories.value;
}
const error = deleteCategoryError || deleteSubcategoryError;
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ onClick: (__VLS_ctx.handleCategoryClick) },
    ...{ style: {} },
});
(category.name);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.toggleOptions) },
    ...{ onBlur: (__VLS_ctx.closeOptions) },
    ...{ style: {} },
});
if (__VLS_ctx.isOptionsOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "category-options" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.openAddSubcategoryModal) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.deleteCategory) },
    });
}
if (__VLS_ctx.showSubcategories) {
    /** @type {[typeof SubcategoryView, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(SubcategoryView, new SubcategoryView({
        ...{ 'onSubcategoryDeleteClicked': {} },
        subcategories: (__VLS_ctx.subcategories),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onSubcategoryDeleteClicked': {} },
        subcategories: (__VLS_ctx.subcategories),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = {
        onSubcategoryDeleteClicked: (__VLS_ctx.deleteSubcategory)
    };
    var __VLS_2;
}
/** @type {[typeof AddSubcategoryModal, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(AddSubcategoryModal, new AddSubcategoryModal({
    ...{ 'onSubcategoriesAdded': {} },
    category: (category),
    modelValue: (__VLS_ctx.isAddSubcategoryModalOpen),
}));
const __VLS_8 = __VLS_7({
    ...{ 'onSubcategoriesAdded': {} },
    category: (category),
    modelValue: (__VLS_ctx.isAddSubcategoryModalOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_10;
let __VLS_11;
let __VLS_12;
const __VLS_13 = {
    onSubcategoriesAdded: (__VLS_ctx.subcategoriesAdded)
};
var __VLS_9;
if (__VLS_ctx.error) {
    /** @type {[typeof Error, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(Error, new Error({
        error: (__VLS_ctx.error),
    }));
    const __VLS_15 = __VLS_14({
        error: (__VLS_ctx.error),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
}
/** @type {__VLS_StyleScopedClasses['category-options']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AddSubcategoryModal: AddSubcategoryModal,
            SubcategoryView: SubcategoryView,
            Error: Error,
            deleteCategory: deleteCategory,
            subcategories: subcategories,
            deleteSubcategory: deleteSubcategory,
            subcategoriesAdded: subcategoriesAdded,
            isAddSubcategoryModalOpen: isAddSubcategoryModalOpen,
            openAddSubcategoryModal: openAddSubcategoryModal,
            isOptionsOpen: isOptionsOpen,
            toggleOptions: toggleOptions,
            closeOptions: closeOptions,
            showSubcategories: showSubcategories,
            handleCategoryClick: handleCategoryClick,
            error: error,
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
