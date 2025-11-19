<script lang="ts" setup>
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { computed, onMounted, ref, useTemplateRef } from 'vue'

const inputId = Math.random().toString(36).substring(2, 15)

const { autofocus, type = 'string' } = defineProps<{
  autofocus?: boolean
  type?: string
}>()
const model = defineModel<string | number | Date>()

const showTooltip = ref(false)

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
      const el = inputRef.value
      if (el && el.scrollWidth > el.clientWidth) {
        showTooltip.value = true
      } else {
        showTooltip.value = false
      }
    }
  },
})
</script>

<template>
  <div class="group relative w-full">
    <input
      :id="inputId"
      class="w-full px-2 truncate is-truncated"
      ref="input-ref"
      v-model="transformedModel"
      :type="type"
    />
    <div
      v-if="showTooltip"
      class="group-hover:visible absolute left-0 invisible z-5000 whitespace-normal bg-gray-800 text-white text-sm p-2 rounded"
    >
      {{ transformedModel }}
    </div>
  </div>
</template>

<style scoped></style>
