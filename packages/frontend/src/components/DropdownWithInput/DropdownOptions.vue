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
  onCreateOption?: (searchText: string) => Promise<string | undefined | void>
}>()
const emits = defineEmits<{
  dropdownOptionClick: [option: string]
  optionCreated: [value: string]
}>()

const searchText = ref('')
const isCreating = ref(false)
const createError = ref<string>()

const filteredOptions = computed(() => {
  if (!searchable || !searchText.value.trim()) {
    return options
  }

  const query = searchText.value.trim().toLowerCase()
  return options.filter((option) => option.toLowerCase().includes(query))
})

const trimmedSearchText = computed(() => searchText.value.trim())

const hasExactMatch = computed(() =>
  options.some((option) => option.toLowerCase() === trimmedSearchText.value.toLowerCase()),
)

const showCreateButton = computed(() => Boolean(searchable) && Boolean(onCreateOption))

const canCreate = computed(
  () => showCreateButton.value && trimmedSearchText.value !== '' && !hasExactMatch.value,
)

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
    if (createdValue) {
      emits('optionCreated', createdValue)
    }
  } catch (err) {
    createError.value = err instanceof Error ? err.message : 'Failed to create option'
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <div
    class="dropdown-options fixed z-2000 bg-white border p-1 max-h-[200px] overflow-y-auto shadow-xs"
    :style="optionsStyle"
  >
    <input
      v-if="searchable"
      v-model="searchText"
      type="text"
      class="sticky top-0 w-full px-1 mb-1 border border-gray-300 rounded-sm bg-white"
      placeholder="Search..."
      @mousedown.stop
    />
    <div
      v-for="option of filteredOptions"
      :key="option"
      class="p-1 hover:bg-gray-100/50 whitespace-normal wrap-break-word"
      @mousedown.stop="optionClicked(option)"
    >
      <span>{{ option }}</span>
    </div>
    <button
      v-if="showCreateButton"
      type="button"
      class="sticky bottom-0 w-full mt-1 px-1 py-0.5 text-sm text-left bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100/50"
      :disabled="!canCreate || isCreating"
      @mousedown.stop="handleCreateClick"
    >
      {{ isCreating ? 'Creating...' : `Create "${trimmedSearchText}"` }}
    </button>
    <p v-if="createError" class="text-red-500 text-xs mt-1">{{ createError }}</p>
  </div>
</template>

<style></style>
