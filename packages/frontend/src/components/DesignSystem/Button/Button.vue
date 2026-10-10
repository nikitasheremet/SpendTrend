<script setup lang="ts">
type IndicatorColor = 'yellow' | 'red'

const primaryClass = 'bg-gray-200 px-3.5 py-1.5 rounded-md hover:bg-gray-200/50'
const textClass = 'text-sm font-medium text-gray-900 bg-transparent'
const secondaryClass = 'bg-transparent px-3.5 py-1.5 rounded-md hover:bg-gray-200 w-fit'
const indicatorBaseClass =
  'absolute top-0 right-0 h-3.5 w-3.5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-100 group-hover:opacity-50'
const indicatorColorClassMap: Record<IndicatorColor, string> = {
  yellow: 'bg-yellow-400',
  red: 'bg-red-500',
}

const classMap = {
  primary: primaryClass,
  text: textClass,
  secondary: secondaryClass,
  empty: '',
}

const {
  classToAdd,
  type = 'primary',
  showIndicator = false,
  indicatorColor = 'yellow',
  loading = false,
  disabled = false,
} = defineProps<{
  classToAdd?: string
  type?: keyof typeof classMap
  showIndicator?: boolean
  indicatorColor?: IndicatorColor
  loading?: boolean
  disabled?: boolean
}>()

const defaultClass =
  'cursor-pointer relative group disabled:cursor-not-allowed disabled:opacity-60'
const buttonClass = defaultClass + ' ' + (classToAdd || '') + ' ' + (classMap[type] || '')
const indicatorClass =
  indicatorBaseClass +
  ' ' +
  (indicatorColorClassMap[indicatorColor] || indicatorColorClassMap.yellow)
</script>
<template>
  <button :class="buttonClass" :disabled="disabled || loading" :aria-busy="loading || undefined">
    <span
      v-if="loading"
      class="inline-block w-3 h-3 mr-1.5 align-[-0.125em] border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"
      aria-hidden="true"
    ></span>
    <slot></slot>
    <span v-if="showIndicator" :class="indicatorClass" aria-hidden="true"></span>
  </button>
</template>
