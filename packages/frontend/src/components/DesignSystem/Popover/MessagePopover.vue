<script setup lang="ts">
const { message } = defineProps<{
  message: string
}>()
</script>

<template>
  <p>{{ message }}</p>
</template>
