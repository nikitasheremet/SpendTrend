<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  expenseCount: number
  incomeCount: number
}>()

function pluralize(count: number, singular: string): string {
  return count === 1 ? `1 ${singular}` : `${count} ${singular}s`
}

const message = computed(() => {
  if (props.expenseCount === 0 && props.incomeCount === 0) {
    return 'No data could be extracted from the pasted info'
  }

  if (props.expenseCount > 0 && props.incomeCount > 0) {
    return `${pluralize(props.expenseCount, 'expense')} and ${pluralize(props.incomeCount, 'income')} added`
  }

  if (props.expenseCount > 0) {
    return `${pluralize(props.expenseCount, 'expense')} added`
  }

  return `${pluralize(props.incomeCount, 'income')} added`
})
</script>

<template>
  <p>{{ message }}</p>
</template>
