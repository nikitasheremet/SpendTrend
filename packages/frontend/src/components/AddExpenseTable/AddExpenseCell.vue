<script lang="ts" setup>
import Input from '@/components/DesignSystem/Input.vue'
import DropdownWithInput from '../DropdownWithInput/DropdownWithInput.vue'
import { computed } from 'vue'

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
</script>

<template>
  <td>
    <DropdownWithInput
      v-if="type === 'dropdown'"
      :dropdown-options="dropdownOptions"
      v-model="dropdownModel"
    />
    <Input v-else :type="type" v-model="model" />
  </td>
</template>

<style scoped></style>
