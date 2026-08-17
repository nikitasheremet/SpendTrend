<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useScrollPast } from '@/helpers/hooks/useScrollPast'
import { getThemeSpacingPx } from '@/helpers/css/getThemeSpacingPx'
import TableColumnFilter from '@/components/DesignSystem/Table/TableColumnFilter.vue'
import { SORT_ASCENDING, SORT_DESCENDING, type FilterValue, type TableHeader } from '@/components/DesignSystem/Table/types'

const theadRef = ref<HTMLElement | null>(null)

const { headers, stickyTopOffsetPx } = defineProps<{
  headers: TableHeader[]
  stickyTopOffsetPx?: number
}>()

const emit = defineEmits<{
  'filter:changed': [key: string, value: FilterValue]
  'sort:changed': [key: string]
}>()

const stickyTopPx = computed(() => stickyTopOffsetPx ?? getThemeSpacingPx('nav'))
const { hasScrolledPast } = useScrollPast(theadRef, { triggerOffsetPx: stickyTopPx })

function handleFilterChange(key: string | undefined, value: FilterValue) {
  if (!key) {
    return
  }
  emit('filter:changed', key, value)
}

function handleSortChange(key: string | undefined) {
  if (!key) {
    return
  }
  emit('sort:changed', key)
}

function getSortGlyph(direction: TableHeader['sortDirection']): string {
  if (direction === SORT_ASCENDING) {
    return '↑'
  }
  if (direction === SORT_DESCENDING) {
    return '↓'
  }
  return '↕'
}

function getAriaSort(direction: TableHeader['sortDirection']): 'ascending' | 'descending' | 'none' {
  if (direction === SORT_ASCENDING) {
    return 'ascending'
  }
  if (direction === SORT_DESCENDING) {
    return 'descending'
  }
  return 'none'
}
</script>

<template>
  <thead ref="theadRef">
    <tr>
      <th
        v-for="(header, index) in headers"
        :key="index"
        class="sticky"
        :class="[
          header.customClass,
          {
            'z-table-header bg-white min-h-11 align-bottom': hasScrolledPast,
          },
        ]"
        :style="{ top: `${stickyTopPx}px` }"
        :aria-sort="header.sortable ? getAriaSort(header.sortDirection) : undefined"
      >
        <span class="inline-flex items-center gap-1">
          {{ header.label }} <span v-if="header.required" class="text-red-700 text-2xl">*</span>
          <button
            v-if="header.sortable && header.sortKey"
            type="button"
            class="flex items-center justify-center w-5 h-5 rounded-sm hover:bg-gray-200"
            :class="{ 'text-blue-600': header.sortDirection, 'text-gray-500': !header.sortDirection }"
            :aria-label="`Sort by ${header.label}`"
            @click="handleSortChange(header.sortKey)"
          >
            <span class="text-xs leading-none">{{ getSortGlyph(header.sortDirection) }}</span>
          </button>
          <TableColumnFilter
            v-if="header.filterable && header.filterKey && header.filterType"
            :filter-key="header.filterKey"
            :label="header.label"
            :type="header.filterType"
            :options="header.filterOptions"
            :model-value="header.filterValue"
            @update:model-value="(value) => handleFilterChange(header.filterKey, value as FilterValue)"
          />
        </span>
      </th>
    </tr>
  </thead>
</template>

<style scoped></style>
