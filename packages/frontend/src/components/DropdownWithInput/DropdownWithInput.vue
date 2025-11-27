<script lang="ts" setup>
import { ref, defineProps, watch } from 'vue'
import Input from '@/components/DesignSystem/Input.vue'
import DropdownOptions from './DropdownOptions.vue'
import { useDropdownOptionHandlers } from './useDropdownOptionHandlers'

const dropdownInputModel = defineModel<string | undefined>()
const props = defineProps<{
  dropdownOptions: string[]
  autofocus?: boolean
}>()
const emit = defineEmits<{
  onChange: [string]
  blur: []
  isInputValid: [boolean]
  escapeKeyPressed: []
}>()

const isEscapeKeyPressed = ref(false)
const {
  showCategoryOptions,
  hideCategoryOptions,
  listOfOptionsToDisplay,
  dropdownInputFocus,
  filterListBasedOnInput,
} = useDropdownOptionHandlers({
  dropdownOptions: () => props.dropdownOptions,
})

watch(
  () => props.dropdownOptions,
  (newDropdownOptions) => {
    listOfOptionsToDisplay.value = newDropdownOptions
  },
)

function isInputValid(input: string) {
  if (!input) {
    return true
  }
  return Boolean(props.dropdownOptions.find((dropdownOption) => dropdownOption === input))
}

function handleInput(event: Event) {
  const targetValue = (event.target as HTMLInputElement).value
  emit('onChange', targetValue)
  emit('isInputValid', isInputValid(targetValue))
  filterListBasedOnInput(targetValue)
}
function setInput(valueSelected: string) {
  dropdownInputModel.value = valueSelected
  hideCategoryOptions()
}

function blurInput(event: KeyboardEvent, isEscapeKey?: boolean) {
  isEscapeKeyPressed.value = Boolean(isEscapeKey)
  ;(event.target as HTMLInputElement).blur()
}
function handleInputBlur(event: FocusEvent) {
  const eventTarget = event.target as HTMLInputElement
  const eventRelatedTarget = event.relatedTarget as HTMLElement
  const parentElement = eventTarget.parentElement

  // Check if the relatedTarget is a descendant of the dropdown-input parent
  const isBlurOutsideDropdownInput =
    !eventRelatedTarget || !parentElement?.contains(eventRelatedTarget)

  if (isBlurOutsideDropdownInput) {
    eventTarget.parentNode?.dispatchEvent(new Event('blur'))
    if (isEscapeKeyPressed.value) {
      emit('escapeKeyPressed')
      isEscapeKeyPressed.value = false
    } else {
      emit('blur')
    }
  }
}
</script>

<template>
  <div class="relative dropdown-input" @blur="hideCategoryOptions" tabindex="-1">
    <Input
      :autofocus="autofocus"
      v-model="dropdownInputModel"
      @input="handleInput"
      @focus="showCategoryOptions"
      @blur="handleInputBlur"
      @keyup.enter="blurInput"
      @keyup.esc="(e: KeyboardEvent) => blurInput(e, true)"
    />

    <DropdownOptions
      v-if="dropdownInputFocus"
      @dropdown-option-click="setInput"
      :options="listOfOptionsToDisplay"
    />
  </div>
</template>

<style scoped></style>
