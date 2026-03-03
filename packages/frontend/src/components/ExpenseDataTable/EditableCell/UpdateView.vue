<!-- <script lang="ts" setup>
import { nextTick, ref } from 'vue'
import Input from '@/components/DesignSystem/Input.vue'
import DropdownWithInput from '@/components/DropdownWithInput/DropdownWithInput.vue'

const { initialValue, inputType, inputCategories } = defineProps<{
  initialValue: any
  inputType: string
  inputCategories?: string[]
}>()
const emit = defineEmits<{
  onUpdateComplete: [string | number]
}>()

const updatedValue = ref<any>(initialValue)

function clearUpdatedValue() {
  updatedValue.value = undefined
}

function handleInputSave() {
  emit('onUpdateComplete', updatedValue.value)
  clearUpdatedValue()
}

async function handleCancelInput() {
  clearUpdatedValue()
  await nextTick()
  emit('onUpdateComplete', updatedValue.value)
}

const isInputDropdown = inputType === 'dropdown'
</script>

<template>
  <DropdownWithInput
    v-if="isInputDropdown"
    v-model="updatedValue"
    autofocus
    :dropdown-options="inputCategories || []"
    @blur="handleInputSave"
    @escape-key-pressed="handleCancelInput"
  />
  <Input
    v-else
    id="new-value-input"
    v-model="updatedValue"
    autofocus
    :type="inputType"
    @blur="handleInputSave"
    @keyup.enter="handleInputSave"
    @keyup.esc="handleCancelInput"
  />
</template>

<style scoped></style> -->
