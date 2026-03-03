<script lang="ts" setup>
import Input from '@/components/DesignSystem/Input.vue'
import DropdownWithInput from '../DropdownWithInput/DropdownWithInput.vue'
import { computed } from 'vue'

const model = defineModel<string | number | undefined>()
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
</script>

<template>
  <td class="border p-1">
    <DropdownWithInput
      v-if="type === 'dropdown'"
      v-model="dropdownModel"
      :dropdown-options="dropdownOptions"
    />
    <Input v-model="model" class="border-none" :type="type" />
  </td>
</template>

<style scoped></style>
