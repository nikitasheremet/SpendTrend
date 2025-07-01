export type ComponentProps = {
    type: 'date';
    data?: number;
    options?: never;
} | {
    type: 'text';
    data?: string;
    options?: never;
} | {
    type: 'number';
    data?: number;
    options?: never;
} | {
    type: 'dropdown';
    options: string[];
    data?: string;
};
declare const _default: import("vue").DefineComponent<{
    type: "date";
    data?: number;
    options?: never;
} | {
    type: "text";
    data?: string;
    options?: never;
} | {
    type: "number";
    data?: number;
    options?: never;
} | {
    type: "dropdown";
    options: string[];
    data?: string;
}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    onSave: (args_0: string | number | undefined) => any;
}, string, import("vue").PublicProps, Readonly<{
    type: "date";
    data?: number;
    options?: never;
} | {
    type: "text";
    data?: string;
    options?: never;
} | {
    type: "number";
    data?: number;
    options?: never;
} | {
    type: "dropdown";
    options: string[];
    data?: string;
}> & Readonly<{
    onOnSave?: ((args_0: string | number | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
