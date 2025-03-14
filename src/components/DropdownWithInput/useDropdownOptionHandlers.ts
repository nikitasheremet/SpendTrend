import { ref } from 'vue'

export function useDropdownOptionHandlers({ dropdownOptions }: { dropdownOptions: string[] }) {
  const dropdownInputFocus = ref(false)
  const listOfOptionsToDisplay = ref(dropdownOptions)

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
    listOfOptionsToDisplay.value = dropdownOptions.filter((listItem) =>
      listItem.includes(inputValue),
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
