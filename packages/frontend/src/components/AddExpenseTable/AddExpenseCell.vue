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

const inputModel = computed({
  get() {
    return model.value as string | number | undefined
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
    <!-- prettier-ignore -->
    <DropdownWithInput
      v-if="type === 'dropdown'"
      :dropdown-options="dropdownOptions" 
      v-model="(model as string | undefined)"
    />
    <Input class="border-none" v-else :type="type" v-model="inputModel" />
  </td>
</template>

<style scoped></style>
