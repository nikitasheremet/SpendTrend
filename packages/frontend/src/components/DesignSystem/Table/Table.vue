<script setup lang="ts">
type DataType = 'string' | 'number' | 'dropdown' | 'date'
const { data } = defineProps<{ data: { [key: string]: { value: any; type?: DataType } }[] }>()
</script>
<template>
  <table>
    <thead></thead>
    <tbody></tbody>
  </table>
</template>
