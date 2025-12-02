<script lang="ts" setup>
import { ref } from 'vue'
import { useScrollPast } from '@/helpers/hooks/useScrollPast'

const theadRef = ref<HTMLElement | null>(null)
const { hasScrolledPast } = useScrollPast(theadRef)

const { headers } = defineProps<{
  headers: {
    label: string
    required?: boolean
    customClass?: string
  }[]
}>()
</script>

<template>
  <thead ref="theadRef">
    <tr>
      <th
        v-for="(header, index) in headers"
        :key="index"
        class="sticky"
        :class="{ 'top-15 z-40 bg-white h-11 align-bottom': hasScrolledPast }"
      >
        {{ header.label }} <span v-if="header.required" class="text-red-700 text-2xl">*</span>
      </th>
    </tr>
  </thead>
</template>

<style scoped></style>
