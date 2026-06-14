<script lang="ts" setup>
import { ref } from 'vue'
import { useScrollPast } from '@/helpers/hooks/useScrollPast'

const theadRef = ref<HTMLElement | null>(null)
const { hasScrolledPast } = useScrollPast(theadRef)

const { headers, stickyTopOffsetPx } = defineProps<{
  headers: {
    label: string
    required?: boolean
    customClass?: string
  }[]
  stickyTopOffsetPx?: number
}>()
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
            'top-nav': hasScrolledPast && stickyTopOffsetPx === undefined,
          },
        ]"
        :style="hasScrolledPast && stickyTopOffsetPx !== undefined ? { top: `${stickyTopOffsetPx}px` } : undefined"
      >
        {{ header.label }} <span v-if="header.required" class="text-red-700 text-2xl">*</span>
      </th>
    </tr>
  </thead>
</template>

<style scoped></style>
