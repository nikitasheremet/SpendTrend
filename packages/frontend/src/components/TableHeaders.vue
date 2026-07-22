<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useScrollPast } from '@/helpers/hooks/useScrollPast'
import { getThemeSpacingPx } from '@/helpers/css/getThemeSpacingPx'
import TableColumnFilter from '@/components/DesignSystem/Table/TableColumnFilter.vue'
import type { FilterValue } from '@/components/DesignSystem/Table/types'

const theadRef = ref<HTMLElement | null>(null)

const { headers, stickyTopOffsetPx } = defineProps<{
  headers: {
    label: string
    required?: boolean
    customClass?: string
    filterable?: boolean
    filterKey?: string
    filterType?: 'dropdown' | 'date'
    filterOptions?: string[]
    filterValue?: FilterValue
  }[]
  stickyTopOffsetPx?: number
}>()

const emit = defineEmits<{
  'filter:changed': [key: string, value: FilterValue]
}>()

const stickyTopPx = computed(() => stickyTopOffsetPx ?? getThemeSpacingPx('nav'))
const { hasScrolledPast } = useScrollPast(theadRef, { triggerOffsetPx: stickyTopPx })

function handleFilterChange(key: string | undefined, value: FilterValue) {
  if (!key) {
    return
  }
  emit('filter:changed', key, value)
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
      >
        <span class="inline-flex items-center gap-1">
          {{ header.label }} <span v-if="header.required" class="text-red-700 text-2xl">*</span>
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
