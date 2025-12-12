<script setup lang="ts">
import { nextTick, ref } from 'vue'
import DropdownOptions from './DropdownOptions.vue'

const { value, dropdownOptions, autofocus } = defineProps<{
  value: string | undefined
  dropdownOptions: string[]
  autofocus?: boolean
}>()
const emit = defineEmits<{
  onChange: [option: string]
}>()
const isOptionsVisible = ref(autofocus)

defineExpose({
  hideOptions: () => {
    isOptionsVisible.value = false
  },
})

async function handleDropdownOptionsClick(option: string) {
  isOptionsVisible.value = false
  await nextTick()
  emit('onChange', option)
}

function toggleOptionsVisibility() {
  isOptionsVisible.value = !isOptionsVisible.value
}
</script>

<template>
  <div
    class="flex justify-between items-center px-2 border border-gray-500 rounded-md min-h-6"
    @click="toggleOptionsVisibility"
  >
    {{ value }}<span inert class="text-[10px] flex-1 text-end">{{ '▼' }}</span>
  </div>
  <DropdownOptions
    :options="dropdownOptions"
    v-if="isOptionsVisible"
    @dropdownOptionClick="handleDropdownOptionsClick"
  />
</template>
