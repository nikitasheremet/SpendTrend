<script setup lang="ts">
const { isModalOpen, message } = defineProps<{
  isModalOpen: boolean
  message?: string
}>()
</script>

<template>
  <div
    id="loading-modal-outer-container"
    v-if="isModalOpen"
    class="fixed top-0 left-0 h-screen w-screen z-2000 bg-black/80 flex items-center justify-center"
  >
    <div
      id="loading-modal-inner-container"
      class="p-6 bg-white rounded-lg flex flex-col items-center gap-4"
    >
      <div
        class="loading-spinner w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"
      ></div>
      <p class="loading-message text-base text-gray-800 m-0">{{ message || 'Loading...' }}</p>
    </div>
  </div>
</template>
