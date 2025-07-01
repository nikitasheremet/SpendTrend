import type { Expense } from '@/types/expenseData';
type __VLS_Props = {
    expense: Expense;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    onError: (args_0: Error) => any;
    expenseDeleted: (args_0: Expense) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onOnError?: ((args_0: Error) => any) | undefined;
    onExpenseDeleted?: ((args_0: Expense) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
