<script setup lang="ts">
import Button from '../Button/Button.vue'

const { tabs, currentTab } = defineProps<{
  tabs: {
    label: string
    value: string
  }[]
  currentTab: string
}>()

const emit = defineEmits<{
  tabClicked: [tabValue: string]
}>()
</script>
<template>
  <div class="border border-gray-300 rounded-t-md w-fit mb-5">
    <Button
      type="empty"
      v-for="tab of tabs"
      class="px-4 py-1.5 rounded-t-md"
      :class="{ 'bg-gray-200': currentTab === tab.value }"
      @click="emit('tabClicked', tab.value)"
    >
      {{ tab.label }}
    </Button>
  </div>
</template>
