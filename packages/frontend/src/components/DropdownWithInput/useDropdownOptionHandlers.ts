import { MaybeRefOrGetter, Ref, ref, toValue } from 'vue'

export function useDropdownOptionHandlers({
  dropdownOptions,
}: {
  dropdownOptions: MaybeRefOrGetter<string[]>
}) {
  const dropdownInputFocus = ref(false)
  const listOfOptionsToDisplay = ref(toValue(dropdownOptions))

  function hideCategoryOptions() {
    dropdownInputFocus.value = false
  }
  function showCategoryOptions() {
    dropdownInputFocus.value = true
  }

  function filterListBasedOnInput(inputValue: string) {
    if (!dropdownInputFocus.value) {
      dropdownInputFocus.value = true
    }
    if (!inputValue.trim()) {
      listOfOptionsToDisplay.value = toValue(dropdownOptions)
      return
    }
    listOfOptionsToDisplay.value = toValue(dropdownOptions).filter((listItem) =>
      listItem.toLowerCase().includes(inputValue.toLowerCase()),
    )
  }

  return {
    dropdownInputFocus,
    listOfOptionsToDisplay,
    hideCategoryOptions,
    showCategoryOptions,
    filterListBasedOnInput,
  }
}
