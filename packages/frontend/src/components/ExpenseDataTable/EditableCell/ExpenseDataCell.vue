<script lang="ts" setup>
import { ref } from 'vue'
import UpdateView from './UpdateView.vue'
import { DateFormat, formatDate } from '@/helpers/date/formateDate'

export type ComponentProps =
  | { type: 'date'; data?: number; options?: never }
  | { type: 'text'; data?: string; options?: never }
  | { type: 'number'; data?: number; options?: never }
  | { type: 'dropdown'; options: string[]; data?: string }
const { data, options, type = 'text' } = defineProps<ComponentProps>()
const emit = defineEmits<{
  onSave: [string | number | undefined]
}>()
function onSave(value: string | number) {
  emit('onSave', value)
}

const isEditMode = ref(false)

async function turnOnEditMode() {
  if (!isEditMode.value) {
    isEditMode.value = true
  }
}
function turnOffEditMode() {
  isEditMode.value = false
}

function handleUpdateComplete(value: string | number) {
  if (value) {
    onSave(value)
  }

  turnOffEditMode()
}
</script>

<template>
  <td @click="turnOnEditMode" :class="{ editModeOn: isEditMode }">
    <UpdateView
      v-if="isEditMode"
      @on-update-complete="handleUpdateComplete"
      :initialValue="data"
      :inputType="type"
      :inputCategories="options"
    />
    <p v-else>{{ type === 'date' ? formatDate(data!, DateFormat.DD_MMMM_YYYY) : data }}</p>
  </td>
</template>

<style scoped>
#new-value-input {
  width: 100%;
}
td.editModeOn {
  padding: 0;
}
</style>
