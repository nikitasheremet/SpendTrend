type __VLS_Props = {
    dropdownOptions: string[];
    autofocus?: boolean;
};
type __VLS_PublicProps = __VLS_Props & {
    modelValue?: string | undefined;
};
declare const _default: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    blur: () => any;
    onChange: (args_0: string) => any;
    "update:modelValue": (value: string | undefined) => any;
    isInputValid: (args_0: boolean) => any;
    escapeKeyPressed: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    onBlur?: (() => any) | undefined;
    onOnChange?: ((args_0: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
    onIsInputValid?: ((args_0: boolean) => any) | undefined;
    onEscapeKeyPressed?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
