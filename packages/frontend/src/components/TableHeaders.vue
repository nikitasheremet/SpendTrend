<script lang="ts" setup>
const { headers } = defineProps<{
  headers: {
    label: string
    required?: boolean
    customClass?: string
  }[]
}>()
</script>

<template>
  <thead>
    <tr>
      <th v-for="(header, index) in headers" :key="index" :class="header.customClass || ''">
        {{ header.label }} <span v-if="header.required" class="text-red-700 text-2xl">*</span>
      </th>
    </tr>
  </thead>
</template>

<style scoped></style>
