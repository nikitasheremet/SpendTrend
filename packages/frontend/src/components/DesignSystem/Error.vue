<script lang="ts" setup>
defineProps<{
  error: Error
}>()
</script>

<template>
  <div class="error-wrapper">
    <p>{{ error }}</p>
  </div>
</template>

<style scoped>
.error-wrapper {
  background-color: salmon;
  margin-top: 8px;
}
p {
  font-weight: bold;
}
</style>
