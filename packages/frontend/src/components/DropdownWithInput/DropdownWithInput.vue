<script lang="ts" setup>
import { ref, defineProps, watch } from 'vue'
import Input from '@/components/DesignSystem/Input.vue'
import DropdownOptions from './DropdownOptions.vue'
import { useDropdownOptionHandlers } from './useDropdownOptionHandlers'

const model = defineModel<string | undefined>()
const { dropdownOptions, autofocus } = defineProps<{
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
  dropdownOptions,
})

watch(
  () => dropdownOptions,
  (newDropdownOptions) => {
    listOfOptionsToDisplay.value = newDropdownOptions
  },
)

function isInputValid(input: string) {
  if (!input) {
    return true
  }
  return Boolean(dropdownOptions.find((dropdownOption) => dropdownOption === input))
}

function handleInput(event: Event) {
  const targetValue = (event.target as HTMLInputElement).value
  emit('onChange', targetValue)
  emit('isInputValid', isInputValid(targetValue))
  filterListBasedOnInput(targetValue)
}
function setInput(valueSelected: string) {
  model.value = valueSelected
  hideCategoryOptions()
}

function blurInput(event: KeyboardEvent, isEscapeKey?: boolean) {
  isEscapeKeyPressed.value = Boolean(isEscapeKey)
  ;(event.target as HTMLInputElement).blur()
}
function handleInputBlur(event: FocusEvent) {
  const eventTarget = event.target as HTMLInputElement
  const eventRelatedTarget = event.relatedTarget as HTMLElement

  // If no relatedTarget, or the relatedTarget it not the parent element class name then the blur happned because of an interaction with an
  // element external to this component
  const isBlurOutsideDropdownInput =
    !eventRelatedTarget || eventRelatedTarget.classList.contains('dropdown-input') === false

  if (isBlurOutsideDropdownInput) {
    eventTarget.parentNode?.dispatchEvent(new Event('blur'))
    if (isEscapeKeyPressed.value) {
      emit('escapeKeyPressed')
      isEscapeKeyPressed.value = false
    } else {
      emit('blur')
    }
  } else {
    eventTarget.focus()
  }
}
</script>

<template>
  <div class="relative dropdown-input" @blur="hideCategoryOptions" tabindex="-1">
    <Input
      :autofocus="autofocus"
      v-model="model"
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
