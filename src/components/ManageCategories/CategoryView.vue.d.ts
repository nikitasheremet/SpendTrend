import type { Category } from '@/types/expenseData';
type __VLS_Props = {
    category: Category;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    categoryDeleted: (args_0: Category) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onCategoryDeleted?: ((args_0: Category) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
