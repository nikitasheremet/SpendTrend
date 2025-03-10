<script lang="ts" setup>
import { DateFormat, formatDate } from '@/helpers/date/formateDate'
import { computed, onMounted, useTemplateRef } from 'vue'

const { autofocus, type = 'string' } = defineProps<{
  autofocus?: boolean
  type?: string
}>()
const model = defineModel<string | number | Date>()

const inputRef = useTemplateRef('input-ref')
onMounted(() => {
  if (autofocus) {
    inputRef.value?.focus()
  }
})

const transformedModel = computed({
  get() {
    if (type === 'date' && model.value) {
      return formatDate(new Date(model.value), DateFormat.YYYY_MM_DD)
    }
    return model.value
  },
  set(value) {
    if (type === 'date' && value) {
      model.value = new Date(value).getTime()
    } else {
      model.value = value
    }
  },
})
</script>

<template>
  <input ref="input-ref" v-model="transformedModel" :type="type" />
</template>

<style scoped></style>
