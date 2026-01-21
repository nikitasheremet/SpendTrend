<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import UpdateView from './UpdateView.vue'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'

export type ComponentProps =
  | { type: 'date'; data?: string; options?: never }
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
const cellData = ref<string | number | undefined>(data)

watch(
  () => data,
  (newData) => {
    cellData.value = newData
  },
)

const isEditMode = ref(false)
async function turnOnEditMode() {
  if (!isEditMode.value) {
    isEditMode.value = true
  }
}
function turnOffEditMode() {
  isEditMode.value = false
}

const formattedCellData = computed(() => {
  if (type === 'date') {
    return cellData.value ? formatDate(cellData.value!, DateFormat.DD_MMMM_YYYY) : ''
  } else if (type === 'number') {
    return cellData.value !== undefined ? (cellData.value as number).toFixed(2) : ''
  }
  return cellData.value
})

async function handleUpdateComplete(value: string | number) {
  if (value) {
    onSave(value)
    cellData.value = value
    await nextTick()
  }

  turnOffEditMode()
}
</script>

<template>
  <td class="border p-1" @click="turnOnEditMode" :class="{ editModeOn: isEditMode }">
    <UpdateView
      v-if="isEditMode"
      @on-update-complete="handleUpdateComplete"
      :initialValue="cellData"
      :inputType="type"
      :inputCategories="options"
    />
    <p v-else>{{ formattedCellData }}</p>
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
