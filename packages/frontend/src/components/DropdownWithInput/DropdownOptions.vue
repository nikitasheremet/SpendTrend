<script lang="ts" setup>
import { computed, onMounted, ref, useTemplateRef, watch, watchPostEffect } from 'vue'

const NO_HIGHLIGHT = -1

const { options, selectedOption, optionsStyle, searchable, onCreateOption } = defineProps<{
  options: string[]
  selectedOption?: string
  optionsStyle: {
    top: string
    left: string
    width: string
  }
  searchable?: boolean
  onCreateOption?: (searchText: string) => Promise<string>
}>()
const emits = defineEmits<{
  dropdownOptionClick: [option: string]
  optionCreated: [value: string]
}>()

const searchText = ref('')
const isCreating = ref(false)
const createError = ref<string>()
const searchInputRef = useTemplateRef<HTMLInputElement>('search-input-ref')
const panelRef = useTemplateRef<HTMLElement>('panel-ref')

onMounted(() => {
  if (searchable) {
    searchInputRef.value?.focus()
  }
})

const trimmedSearchText = computed(() => searchText.value.trim())

const isSearchTextEmpty = computed(() => trimmedSearchText.value === '')

const filteredOptions = computed(() => {
  if (!searchable || isSearchTextEmpty.value) {
    return options
  }

  const query = trimmedSearchText.value.toLowerCase()
  return options.filter((option) => option.toLowerCase().includes(query))
})

const hasExactMatch = computed(() =>
  options.some((option) => option.toLowerCase() === trimmedSearchText.value.toLowerCase()),
)

const showCreateButton = computed(() => Boolean(searchable) && Boolean(onCreateOption))

const canCreate = computed(
  () => showCreateButton.value && !isSearchTextEmpty.value && !hasExactMatch.value,
)

// Navigable items are the filtered options, then the create button as the last stop.
const createItemIndex = computed(() => filteredOptions.value.length)
const lastNavigableIndex = computed(() =>
  canCreate.value ? createItemIndex.value : filteredOptions.value.length - 1,
)

const highlightedIndex = ref(
  selectedOption === undefined ? NO_HIGHLIGHT : options.indexOf(selectedOption),
)

const isCreateHighlighted = computed(
  () => canCreate.value && highlightedIndex.value === createItemIndex.value,
)

watch(trimmedSearchText, () => {
  highlightedIndex.value = filteredOptions.value.length > 0 ? 0 : NO_HIGHLIGHT
})

watchPostEffect(() => {
  // Reading highlightedIndex makes the effect re-run whenever the highlight moves.
  if (highlightedIndex.value === NO_HIGHLIGHT) {
    return
  }

  panelRef.value?.querySelector('[data-highlighted]')?.scrollIntoView({ block: 'nearest' })
})

defineExpose({ handleKeydown })

const createButtonLabel = computed(() => {
  if (isCreating.value) return 'Creating...'
  if (isSearchTextEmpty.value) return ''
  return `Create "${trimmedSearchText.value}"`
})

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    highlightedIndex.value = Math.min(highlightedIndex.value + 1, lastNavigableIndex.value)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (lastNavigableIndex.value !== NO_HIGHLIGHT) {
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
    }
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    selectHighlightedItem()
  }
}

function selectHighlightedItem() {
  if (highlightedIndex.value === NO_HIGHLIGHT || highlightedIndex.value > lastNavigableIndex.value) {
    return
  }

  if (isCreateHighlighted.value) {
    handleCreateClick()
    return
  }

  optionClicked(filteredOptions.value[highlightedIndex.value])
}

function highlightCreateButton() {
  if (canCreate.value) {
    highlightedIndex.value = createItemIndex.value
  }
}

function optionClicked(option: string) {
  emits('dropdownOptionClick', option)
}

async function handleCreateClick() {
  if (!onCreateOption || !canCreate.value || isCreating.value) {
    return
  }

  isCreating.value = true
  createError.value = undefined
  try {
    const createdValue = await onCreateOption(trimmedSearchText.value)
    emits('optionCreated', createdValue)
  } catch (err) {
    createError.value = err instanceof Error ? err.message : 'Failed to create option'
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <div
    ref="panel-ref"
    class="dropdown-options fixed z-2000 bg-white border p-1 max-h-50 shadow-xs flex flex-col"
    :style="optionsStyle"
    @keydown="handleKeydown"
  >
    <input
      v-if="searchable"
      ref="search-input-ref"
      v-model="searchText"
      type="text"
      class="shrink-0 w-full px-1 mb-1 border border-gray-300 rounded-sm bg-white"
      placeholder="Search..."
      @mousedown.stop
    />
    <div role="listbox" class="flex-1 overflow-y-auto min-h-0">
      <div
        v-for="(option, index) of filteredOptions"
        :key="option"
        role="option"
        :aria-selected="index === highlightedIndex"
        :data-highlighted="index === highlightedIndex || undefined"
        class="p-1 whitespace-normal wrap-break-word"
        :class="{ 'bg-gray-100': index === highlightedIndex }"
        @mouseenter="highlightedIndex = index"
        @mousedown.stop="optionClicked(option)"
      >
        <span>{{ option }}</span>
      </div>
    </div>
    <button
      v-if="showCreateButton"
      type="button"
      class="shrink-0 w-full mt-1 px-1 py-0.5 text-sm text-left disabled:opacity-50 disabled:cursor-not-allowed"
      :class="isCreateHighlighted ? 'bg-gray-100' : 'bg-white'"
      :data-highlighted="isCreateHighlighted || undefined"
      :disabled="!canCreate || isCreating"
      @mouseenter="highlightCreateButton"
      @mousedown.stop="handleCreateClick"
    >
      {{ createButtonLabel }}
    </button>
    <p v-if="createError" class="shrink-0 text-red-500 text-xs mt-1">{{ createError }}</p>
  </div>
</template>

<style></style>
