<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useDropdownPosition } from '@/helpers/hooks/useDropdownPosition'
import { useClickOutside } from '@/helpers/hooks/useClickOutside'
import DropdownOptions from './DropdownOptions.vue'

const {
  value,
  dropdownOptions,
  autofocus,
  includeEmptyOption,
  emptyOptionLabel,
  searchable,
  onCreateOption,
} = defineProps<{
  value: string | undefined
  dropdownOptions: string[]
  autofocus?: boolean
  includeEmptyOption?: boolean
  emptyOptionLabel?: string
  searchable?: boolean
  onCreateOption?: (searchText: string) => Promise<string>
}>()
const emit = defineEmits<{
  onChange: [option: string]
}>()
const EMPTY_SELECTION_VALUE = ''
const DEFAULT_EMPTY_OPTION_LABEL = 'Uncategorized'
const isOptionsVisible = ref(Boolean(autofocus))
const optionsRef = ref<HTMLElement>()
const optionsDivRef = ref<{ $el?: HTMLElement }>()

const { optionsTop, optionsLeft, optionsWidth, positionDropdown } = useDropdownPosition(
  optionsRef,
  optionsDivRef,
)

const dropdownOptionsStyle = computed(() => ({
  top: `${optionsTop.value}px`,
  left: `${optionsLeft.value}px`,
  width: `${optionsWidth.value}px`,
}))

const emptyOptionText = computed(() => emptyOptionLabel || DEFAULT_EMPTY_OPTION_LABEL)

const optionsWithEmptyOption = computed(() => {
  if (!includeEmptyOption) {
    return dropdownOptions
  }

  return [emptyOptionText.value, ...dropdownOptions]
})

const optionsPanelElement = computed(() => optionsDivRef.value?.$el)

// ignoreSelector on the toggle itself is required, not optional: the click that opens the
// dropdown is dispatched from the toggle div, which is never a DOM descendant of the (freshly
// created, teleported) options panel - so without excluding it, that same click's bubble to
// document reads as "outside" and immediately closes the dropdown it just opened.
useClickOutside(
  optionsPanelElement,
  () => isOptionsVisible.value,
  () => {
    isOptionsVisible.value = false
  },
  { ignoreSelector: '[data-dropdown-select-toggle]' },
)

defineExpose({
  hideOptions: (relatedTarget?: EventTarget | null) => {
    if (relatedTarget && optionsPanelElement.value?.contains(relatedTarget as Node)) {
      return
    }

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
  if (includeEmptyOption && option === emptyOptionText.value) {
    emit('onChange', EMPTY_SELECTION_VALUE)
    return
  }

  emit('onChange', option)
}

async function handleOptionCreated(createdValue: string) {
  isOptionsVisible.value = false
  await nextTick()
  emit('onChange', createdValue)
}

async function toggleOptionsVisibility() {
  isOptionsVisible.value = !isOptionsVisible.value
  await positionDropdown(isOptionsVisible.value)
}
</script>

<template>
  <div
    ref="optionsRef"
    data-dropdown-select-toggle
    class="flex justify-between items-center px-2 border border-gray-500 rounded-md min-h-6"
    @click="toggleOptionsVisibility"
  >
    <span class="min-w-0 truncate">{{ value }}</span>
    <span inert class="text-[10px] flex-1 text-end">{{ '▼' }}</span>
  </div>
  <Teleport to="body">
    <DropdownOptions
      v-if="isOptionsVisible"
      ref="optionsDivRef"
      :options="optionsWithEmptyOption"
      :options-style="dropdownOptionsStyle"
      :searchable="searchable"
      :on-create-option="onCreateOption"
      @dropdown-option-click="handleDropdownOptionsClick"
      @option-created="handleOptionCreated"
    />
  </Teleport>
</template>
