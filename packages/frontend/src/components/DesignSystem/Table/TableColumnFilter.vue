<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useDropdownPosition } from '@/helpers/hooks/useDropdownPosition'
import { useClickOutside } from '@/helpers/hooks/useClickOutside'
import Input from '../Input.vue'
import type { DateFilterValue, FilterValue } from './types'

const PORTAL_SELECTOR = '[data-table-column-filter-portal]'
const EMPTY_SELECTION_COUNT = 0

const props = defineProps<{
  filterKey: string
  label: string
  type: 'dropdown' | 'date'
  options?: string[]
}>()

const modelValue = defineModel<FilterValue | undefined>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()

const { optionsTop, optionsLeft, optionsWidth, positionDropdown } = useDropdownPosition(
  triggerRef,
  panelRef,
)

const panelStyle = computed(() => ({
  top: `${optionsTop.value}px`,
  left: `${optionsLeft.value}px`,
  minWidth: `${optionsWidth.value}px`,
}))

const selectedValues = computed<string[]>(() => (Array.isArray(modelValue.value) ? modelValue.value : []))
const dateValue = computed<DateFilterValue>(() =>
  !Array.isArray(modelValue.value) && modelValue.value ? modelValue.value : {},
)

const isActive = computed(() => {
  if (props.type === 'dropdown') {
    return selectedValues.value.length > EMPTY_SELECTION_COUNT
  }
  return Boolean(dateValue.value.from || dateValue.value.to)
})

const dateFrom = computed<string>({
  get: () => dateValue.value.from ?? '',
  set: (value) => {
    modelValue.value = { ...dateValue.value, from: value || undefined }
  },
})

const dateTo = computed<string>({
  get: () => dateValue.value.to ?? '',
  set: (value) => {
    modelValue.value = { ...dateValue.value, to: value || undefined }
  },
})

useClickOutside(triggerRef, () => isOpen.value, close, { ignoreSelector: PORTAL_SELECTOR })

async function toggleOpen() {
  isOpen.value = !isOpen.value
  await positionDropdown(isOpen.value)
}

function close() {
  isOpen.value = false
}

function toggleOption(option: string) {
  const isSelected = selectedValues.value.includes(option)
  modelValue.value = isSelected
    ? selectedValues.value.filter((value) => value !== option)
    : [...selectedValues.value, option]
}

function selectAll() {
  modelValue.value = [...(props.options ?? [])]
}

function clearFilter() {
  modelValue.value = props.type === 'dropdown' ? [] : {}
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}
</script>

<template>
  <div class="relative inline-flex">
    <button
      ref="triggerRef"
      type="button"
      class="flex items-center justify-center w-5 h-5 rounded-sm hover:bg-gray-200"
      :class="{ 'text-blue-600': isActive, 'text-gray-500': !isActive }"
      :aria-label="`Filter by ${label}`"
      :aria-pressed="isActive"
      @click="toggleOpen"
      @keydown="handleKeydown"
    >
      <span class="text-xs leading-none">&#9660;</span>
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="panelRef"
        data-table-column-filter-portal
        class="fixed z-2000 bg-white border p-2 shadow-xs"
        :style="panelStyle"
        @keydown="handleKeydown"
      >
        <div v-if="type === 'dropdown'" class="flex flex-col gap-1">
          <div class="flex justify-between gap-2 mb-1 text-xs">
            <button type="button" class="underline" @click="selectAll">Select all</button>
            <button type="button" class="underline" @click="clearFilter">Clear</button>
          </div>
          <div class="max-h-[200px] overflow-y-auto flex flex-col gap-1">
            <label
              v-for="option in options ?? []"
              :key="option"
              class="flex items-center gap-2 px-1 py-0.5 hover:bg-gray-100/50 whitespace-normal wrap-break-word"
            >
              <input
                type="checkbox"
                :checked="selectedValues.includes(option)"
                @change="toggleOption(option)"
              />
              <span>{{ option }}</span>
            </label>
          </div>
        </div>

        <div v-else-if="type === 'date'" class="flex flex-col gap-2 min-w-[180px]">
          <label class="flex flex-col gap-1 text-xs">
            From
            <Input v-model="dateFrom" type="date" variant="input-border" />
          </label>
          <label class="flex flex-col gap-1 text-xs">
            To
            <Input v-model="dateTo" type="date" variant="input-border" />
          </label>
          <button type="button" class="underline text-xs self-start" @click="clearFilter">Clear</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped></style>
