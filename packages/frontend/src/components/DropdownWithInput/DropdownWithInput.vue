<script lang="ts" setup>
import { useTemplateRef, onMounted } from 'vue'
import Select from './Select.vue'

const dropdownInputModel = defineModel<string | undefined>()
const props = defineProps<{
  dropdownOptions: string[]
  autofocus?: boolean
  includeEmptyOption?: boolean
  emptyOptionLabel?: string
}>()
const emit = defineEmits<{
  onChange: [string]
  isInputValid: [boolean]
  escapeKeyPressed: []
}>()

onMounted(() => {
  if (props.autofocus) {
    selectRef.value?.focus()
  }
})

const selectRef = useTemplateRef<HTMLElement>('select-ref')
const innerSelectRef = useTemplateRef<typeof Select>('inner-select-ref')

function isInputValid(input: string) {
  if (!input) {
    return true
  }
  return Boolean(props.dropdownOptions.find((dropdownOption) => dropdownOption === input))
}

function handleInput(optionSelected: string) {
  dropdownInputModel.value = optionSelected
  emit('onChange', optionSelected)
  emit('isInputValid', isInputValid(optionSelected))
  selectRef.value?.blur()
}

function handleKey(keyboardEvent: KeyboardEvent) {
  if (keyboardEvent.key === 'Escape') {
    emit('escapeKeyPressed')
  }
}

function handleBlur() {
  innerSelectRef.value?.hideOptions()
}
</script>

<template>
  <div
    ref="select-ref"
    class="relative dropdown-input"
    tabindex="-1"
    editable
    @keydown="handleKey"
    @blur="handleBlur"
  >
    <Select
      ref="inner-select-ref"
      :autofocus="props.autofocus"
      :value="dropdownInputModel"
      :dropdown-options="props.dropdownOptions"
      :include-empty-option="props.includeEmptyOption"
      :empty-option-label="props.emptyOptionLabel"
      @on-change="handleInput"
    ></Select>
  </div>
</template>

<style scoped></style>
