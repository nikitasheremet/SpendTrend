<script lang="ts" setup>
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'

import { useAttrs } from 'vue'
const attrs = useAttrs()

const {
  autofocus,
  type = 'string',
  variant = 'input',
} = defineProps<{
  autofocus?: boolean
  type?: string
  variant?: 'input' | 'input-border' | 'textarea' | 'textarea-border'
}>()
const model = defineModel<string | number>()

const emits = defineEmits<{
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const showTooltip = ref(false)
const transformedModel = ref<string>('')
const isInputFocused = ref(false)

const isTextLikeInputType = type === 'string' || type === 'text'

const inputRef = useTemplateRef('input-ref')
onMounted(async () => {
  if (autofocus) {
    inputRef.value?.focus()
  }

  syncTransformedModel()
  showHideTooltip()

  // Auto-grow textarea on mount if it has content
  if (variant === 'textarea' || variant === 'textarea-border') {
    await nextTick()
    const textarea = inputRef.value as HTMLTextAreaElement
    if (textarea) {
      autoGrowTextarea(textarea)
    }
  }
})

function syncTransformedModel({
  forceNumberFormatting = false,
}: { forceNumberFormatting?: boolean } = {}) {
  if (type === 'date' && model.value) {
    if (typeof model.value === 'string') {
      transformedModel.value = model.value
      return
    }

    transformedModel.value = formatDate(new Date(model.value), DateFormat.YYYY_MM_DD)
  } else if (type === 'number') {
    if (isInputFocused.value && !forceNumberFormatting) {
      return
    }

    if (model.value === undefined || model.value === null || model.value === '') {
      transformedModel.value = ''
      return
    }

    transformedModel.value = (model.value as number).toFixed(2)
  } else {
    transformedModel.value = model.value?.toString() ?? ''
  }
}

async function showHideTooltip() {
  // Disable tooltip for textarea variant since full text is visible
  if (variant === 'textarea' || variant === 'textarea-border') {
    showTooltip.value = false
    return
  }

  if (!isTextLikeInputType) {
    showTooltip.value = false
    return
  }

  await nextTick()
  const el = inputRef.value
  const elementTooLong = el && el.scrollWidth > el.clientWidth
  const isFocused = document.activeElement === el
  if (elementTooLong && transformedModel.value && !isFocused) {
    showTooltip.value = true
  } else {
    showTooltip.value = false
  }
}

function autoGrowTextarea(target: HTMLTextAreaElement) {
  // Reset height to auto to recalculate scrollHeight
  target.style.height = 'auto'
  // Set height to scrollHeight to accommodate all content
  target.style.height = target.scrollHeight + 'px'
}

function onChange(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  const value = target.value

  // Auto-grow textarea
  if (variant === 'textarea' || variant === 'textarea-border') {
    autoGrowTextarea(target as HTMLTextAreaElement)
  }

  if (type === 'number') {
    const isValidNumber = /^\d*\.?\d*$/.test(value)
    const hasMoreThanTwoDecimals = /\.\d{3,}/.test(value)
    if (hasMoreThanTwoDecimals || !isValidNumber) {
      target.value = transformedModel.value
      return
    }
  }

  transformedModel.value = value

  if (type === 'date' && value) {
    model.value = value
    return
  }
  if (type === 'number') {
    const numberValue = parseFloat(transformedModel.value)
    model.value = isNaN(numberValue) ? '' : numberValue
    return
  }
  model.value = value
}

function inputBlurred(event: FocusEvent) {
  isInputFocused.value = false
  syncTransformedModel({ forceNumberFormatting: true })
  showHideTooltip()
  emits('blur', event)
}

function inputFocused(event: FocusEvent) {
  isInputFocused.value = true
  showHideTooltip()
  emits('focus', event)
}

watch(model, async () => {
  syncTransformedModel()
  showHideTooltip()

  // Auto-grow textarea when model changes externally
  if (variant === 'textarea' || variant === 'textarea-border') {
    await nextTick()
    const textarea = inputRef.value as HTMLTextAreaElement
    if (textarea) {
      autoGrowTextarea(textarea)
    }
  }
})

defineExpose({
  blur: () => {
    inputRef.value?.blur()
  },
})
</script>

<template>
  <input
    v-if="variant === 'input' || variant === 'input-border'"
    ref="input-ref"
    :class="[
      'w-full px-2 truncate is-truncated peer rounded-sm',
      variant === 'input-border' ? 'border border-gray-500' : '',
    ]"
    :value="transformedModel"
    :type="type === 'date' ? 'date' : type === 'number' ? 'text' : type"
    v-bind="attrs"
    :aria-label="type === 'date' ? 'date-picker' : undefined"
    @blur="inputBlurred"
    @focus="inputFocused"
    @input="onChange"
  />
  <textarea
    v-else-if="variant === 'textarea' || variant === 'textarea-border'"
    ref="input-ref"
    :class="[
      'w-full px-2 peer rounded-sm resize-none overflow-hidden',
      variant === 'textarea-border' ? 'border border-gray-500' : '',
    ]"
    :value="transformedModel"
    v-bind="attrs"
    rows="1"
    @blur="inputBlurred"
    @focus="inputFocused"
    @input="onChange"
  />
  <div
    v-if="showTooltip"
    id="input-tooltip"
    class="peer-hover:visible absolute invisible z-5000 whitespace-normal bg-gray-800 text-white text-sm p-2 rounded"
  >
    {{ transformedModel }}
  </div>
</template>

<style scoped></style>
