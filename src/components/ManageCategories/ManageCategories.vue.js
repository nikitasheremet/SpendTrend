import CategoryView from './CategoryView.vue';
import AddCategory from './AddCategory.vue';
import { useGetCategories } from './hooks/useGetCategories';
import Error from '../DesignSystem/Error.vue';
const { categories, error, newCategoriesAdded, categoryDeleted } = useGetCategories();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
/** @type {[typeof AddCategory, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AddCategory, new AddCategory({
    ...{ 'onCategoryAdded': {} },
}));
const __VLS_1 = __VLS_0({
    ...{ 'onCategoryAdded': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onCategoryAdded: (__VLS_ctx.newCategoriesAdded)
};
var __VLS_2;
__VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
for (const [category] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
        key: (category.name),
    });
    /** @type {[typeof CategoryView, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(CategoryView, new CategoryView({
        ...{ 'onCategoryDeleted': {} },
        category: (category),
    }));
    const __VLS_8 = __VLS_7({
        ...{ 'onCategoryDeleted': {} },
        category: (category),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    let __VLS_10;
    let __VLS_11;
    let __VLS_12;
    const __VLS_13 = {
        onCategoryDeleted: (__VLS_ctx.categoryDeleted)
    };
    var __VLS_9;
}
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
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CategoryView: CategoryView,
            AddCategory: AddCategory,
            Error: Error,
            categories: categories,
            error: error,
            newCategoriesAdded: newCategoriesAdded,
            categoryDeleted: categoryDeleted,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
