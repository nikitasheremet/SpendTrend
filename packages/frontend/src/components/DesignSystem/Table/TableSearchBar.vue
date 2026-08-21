<script lang="ts" setup>
import { computed } from 'vue'
import { getThemeSpacingPx } from '@/helpers/css/getThemeSpacingPx'
import Input from '../Input.vue'

const { stickyTopOffsetPx } = defineProps<{
  stickyTopOffsetPx?: number
}>()

const modelValue = defineModel<string>({ default: '' })

const stickyTopPx = computed(() => stickyTopOffsetPx ?? getThemeSpacingPx('nav'))
</script>

<template>
  <div
    role="search"
    aria-label="Search table"
    class="sticky z-table-header bg-white py-2"
    :style="{ top: `${stickyTopPx}px` }"
  >
    <div class="w-64 max-w-full">
      <Input v-model="modelValue" type="text" variant="input-border" placeholder="Search…" />
    </div>
  </div>
</template>

<style scoped></style>
