<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useScrollPast } from '@/helpers/hooks/useScrollPast'
import { getThemeSpacingPx } from '@/helpers/css/getThemeSpacingPx'

const theadRef = ref<HTMLElement | null>(null)

const { headers, stickyTopOffsetPx } = defineProps<{
  headers: {
    label: string
    required?: boolean
    customClass?: string
  }[]
  stickyTopOffsetPx?: number
}>()

const stickyTopPx = computed(() => stickyTopOffsetPx ?? getThemeSpacingPx('nav'))
const { hasScrolledPast } = useScrollPast(theadRef, { triggerOffsetPx: stickyTopPx })
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
        {{ header.label }} <span v-if="header.required" class="text-red-700 text-2xl">*</span>
      </th>
    </tr>
  </thead>
</template>

<style scoped></style>
