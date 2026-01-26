<script lang="ts" setup>
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { is } from 'date-fns/locale'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'

import { useAttrs } from 'vue'
const attrs = useAttrs()

const { autofocus, type = 'string' } = defineProps<{
  autofocus?: boolean
  type?: string
}>()
const model = defineModel<string | number | Date>()

const emits = defineEmits<{
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const showTooltip = ref(false)
const transformedModel = ref<string>('')

const inputRef = useTemplateRef('input-ref')
onMounted(() => {
  if (autofocus) {
    inputRef.value?.focus()
  }
  syncTransformedModel()
})

function syncTransformedModel() {
  if (type === 'date' && model.value) {
    transformedModel.value = formatDate(new Date(model.value), DateFormat.YYYY_MM_DD)
  } else if (type === 'number' && model.value !== undefined) {
    transformedModel.value = (model.value as number).toFixed(2)
  } else {
    transformedModel.value = model.value?.toString() ?? ''
  }
}

function showHideTooltip() {
  const el = inputRef.value
  const elementTooLong = el && el.scrollWidth > el.clientWidth
  const isFocused = document.activeElement === el
  if (elementTooLong && transformedModel.value && !isFocused) {
    showTooltip.value = true
  } else {
    showTooltip.value = false
  }
}

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value

  if (type === 'number') {
    const isValidNumber = /^\d*\.?\d*$/.test(value)
    console.log(isValidNumber, value)
    const hasMoreThanTwoDecimals = /\.\d{3,}/.test(value)
    if (hasMoreThanTwoDecimals || !isValidNumber) {
      target.value = transformedModel.value
      return
    }
  }

  transformedModel.value = value

  if (type === 'date' && value) {
    model.value = new Date(value).getTime()
    return
  }
  if (type === 'number') {
    const numberValue = parseFloat(transformedModel.value)
    model.value = isNaN(numberValue) ? '' : numberValue
    return
  }
  model.value = value as any
}

function inputBlurred(event: FocusEvent) {
  syncTransformedModel()
  showHideTooltip()
  emits('blur', event)
}

function inputFocused(event: FocusEvent) {
  showHideTooltip()
  emits('focus', event)
}

watch(model, () => {
  showHideTooltip()
})

defineExpose({
  blur: () => {
    inputRef.value?.blur()
  },
})
</script>

<template>
  <input
    class="w-full px-2 truncate is-truncated peer border border-gray-500 rounded-sm"
    ref="input-ref"
    :value="transformedModel"
    :type="type === 'date' ? 'date' : type === 'number' ? 'text' : type"
    @blur="inputBlurred"
    @focus="inputFocused"
    @input="onChange"
    v-bind="attrs"
  />
  <div
    v-if="showTooltip"
    class="peer-hover:visible absolute invisible z-5000 whitespace-normal bg-gray-800 text-white text-sm p-2 rounded"
  >
    {{ transformedModel }}
  </div>
</template>

<style scoped></style>
