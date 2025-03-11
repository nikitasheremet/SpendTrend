<script lang="ts" setup>
import { ref } from 'vue'
import UpdateView from './UpdateView.vue'
import { store } from '@/store/store'

export type ComponentProps =
  | { type: 'date'; data?: number; subtype?: never }
  | { type: 'text'; data?: string; subtype?: never }
  | { type: 'number'; data?: number; subtype?: never }
  | { type: 'dropdown'; subtype: 'categories' | 'subcategories'; data?: string }
const { data, subtype, type = 'text' } = defineProps<ComponentProps>()
const emit = defineEmits<{
  onSave: [string | number | undefined]
}>()
function onSave(value: string | number) {
  emit('onSave', value)
}

const isEditMode = ref(false)
const dropdownCategories =
  subtype === 'categories' ? store.getCategories() : store.getSubcategories()
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
      :inputCategories="dropdownCategories"
    />
    <p v-else>{{ type === 'date' ? new Date(data as string) : data }}</p>
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
