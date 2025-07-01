export declare function useDropdownOptionHandlers({ dropdownOptions }: {
    dropdownOptions: string[];
}): {
    dropdownInputFocus: import("vue").Ref<boolean, boolean>;
    listOfOptionsToDisplay: import("vue").Ref<string[], string[]>;
    hideCategoryOptions: () => void;
    showCategoryOptions: () => void;
    filterListBasedOnInput: (inputValue: string) => void;
};
