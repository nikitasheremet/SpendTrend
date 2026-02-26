<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { Teleport } from 'vue'
import { useDropdownPosition } from '@/helpers/hooks/useDropdownPosition'
import DropdownOptions from './DropdownOptions.vue'

const { value, dropdownOptions, autofocus } = defineProps<{
  value: string | undefined
  dropdownOptions: string[]
  autofocus?: boolean
}>()
const emit = defineEmits<{
  onChange: [option: string]
}>()
const isOptionsVisible = ref(Boolean(autofocus))
const optionsRef = ref<HTMLElement>()
const optionsDivRef = ref<HTMLElement | { $el?: HTMLElement }>()

const { optionsTop, optionsLeft, optionsWidth, positionDropdown } = useDropdownPosition(
  optionsRef,
  optionsDivRef,
)

const dropdownOptionsStyle = computed(() => ({
  top: `${optionsTop.value}px`,
  left: `${optionsLeft.value}px`,
  width: `${optionsWidth.value}px`,
}))

defineExpose({
  hideOptions: () => {
    isOptionsVisible.value = false
  },
})

onMounted(async () => {
  if (isOptionsVisible.value) {
    await positionDropdown(true)
  }
})

async function handleDropdownOptionsClick(option: string) {
  isOptionsVisible.value = false
  await nextTick()
  emit('onChange', option)
}

async function toggleOptionsVisibility() {
  isOptionsVisible.value = !isOptionsVisible.value
  await positionDropdown(isOptionsVisible.value)
}
</script>

<template>
  <div
    ref="optionsRef"
    class="flex justify-between items-center px-2 border border-gray-500 rounded-md min-h-6"
    @click="toggleOptionsVisibility"
  >
    {{ value }}<span inert class="text-[10px] flex-1 text-end">{{ '▼' }}</span>
  </div>
  <Teleport to="body">
    <DropdownOptions
      ref="optionsDivRef"
      :options="dropdownOptions"
      :options-style="dropdownOptionsStyle"
      v-if="isOptionsVisible"
      @dropdownOptionClick="handleDropdownOptionsClick"
    />
  </Teleport>
</template>
