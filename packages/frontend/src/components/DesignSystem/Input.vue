<script lang="ts" setup>
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
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

const inputRef = useTemplateRef('input-ref')
onMounted(() => {
  if (autofocus) {
    inputRef.value?.focus()
  }
})

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

function inputBlurred(event: FocusEvent) {
  showHideTooltip()
  emits('blur', event)
}

function inputFocused(event: FocusEvent) {
  showHideTooltip()
  emits('focus', event)
}

watch(
  [transformedModel, model],
  async (newValue) => {
    await nextTick()
    showHideTooltip()
  },
  { immediate: true },
)
</script>

<template>
  <input
    class="w-full px-2 truncate is-truncated peer"
    ref="input-ref"
    v-model="transformedModel"
    :type="type"
    @blur="inputBlurred"
    @focus="inputFocused"
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
