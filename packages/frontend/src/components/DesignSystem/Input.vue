<script lang="ts" setup>
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { computed, onMounted, ref, useTemplateRef } from 'vue'

import { useAttrs } from 'vue'
const attrs = useAttrs()

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
  <input
    class="w-full px-2 truncate is-truncated peer"
    ref="input-ref"
    v-model="transformedModel"
    :type="type"
    v-bind="attrs"
  />
  <div
    v-if="showTooltip"
    class="peer-hover:visible absolute left-0 invisible z-5000 whitespace-normal bg-gray-800 text-white text-sm p-2 rounded"
  >
    {{ transformedModel }}
  </div>
</template>

<style scoped></style>
