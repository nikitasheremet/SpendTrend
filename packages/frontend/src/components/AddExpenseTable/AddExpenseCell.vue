<script lang="ts" setup>
import Input from '@/components/DesignSystem/Input.vue'
import DropdownWithInput from '../DropdownWithInput/DropdownWithInput.vue'
import { computed } from 'vue'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'

const model = defineModel<string | number | Date | undefined>()
const { type = 'string', dropdownOptions = [] } = defineProps<{
  type?: string
  dropdownOptions?: string[]
}>()

const dropdownModel = computed({
  get() {
    return model.value as string | undefined
  },
  set(value: string | undefined) {
    model.value = value
  },
})
const inputModel = computed({
  get() {
    return model.value as string | undefined
  },
  set(value: string | undefined) {
    if (type === 'date') {
      model.value = value ? formatDate(new Date(value), DateFormat.YYYY_MM_DD) : undefined
      return
    }
    model.value = value
  },
})
</script>

<template>
  <td class="border p-1">
    <DropdownWithInput
      v-if="type === 'dropdown'"
      :dropdown-options="dropdownOptions"
      v-model="dropdownModel"
    />
    <Input v-else :type="type" v-model="inputModel" />
  </td>
</template>

<style scoped></style>
