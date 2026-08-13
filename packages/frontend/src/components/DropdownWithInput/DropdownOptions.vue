<script lang="ts" setup>
import { computed, ref } from 'vue'

const { options, optionsStyle, searchable, onCreateOption } = defineProps<{
  options: string[]
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

const createButtonLabel = computed(() => {
  if (isCreating.value) return 'Creating...'
  if (isSearchTextEmpty.value) return ''
  return `Create "${trimmedSearchText.value}"`
})

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
    class="dropdown-options fixed z-2000 bg-white border p-1 max-h-50 shadow-xs flex flex-col"
    :style="optionsStyle"
  >
    <input
      v-if="searchable"
      v-model="searchText"
      type="text"
      class="shrink-0 w-full px-1 mb-1 border border-gray-300 rounded-sm bg-white"
      placeholder="Search..."
      @mousedown.stop
    />
    <div class="flex-1 overflow-y-auto min-h-0">
      <div
        v-for="option of filteredOptions"
        :key="option"
        class="p-1 hover:bg-gray-100/50 whitespace-normal wrap-break-word"
        @mousedown.stop="optionClicked(option)"
      >
        <span>{{ option }}</span>
      </div>
    </div>
    <button
      v-if="showCreateButton"
      type="button"
      class="shrink-0 w-full mt-1 px-1 py-0.5 text-sm text-left bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100/50"
      :disabled="!canCreate || isCreating"
      @mousedown.stop="handleCreateClick"
    >
      {{ createButtonLabel }}
    </button>
    <p v-if="createError" class="shrink-0 text-red-500 text-xs mt-1">{{ createError }}</p>
  </div>
</template>

<style></style>
