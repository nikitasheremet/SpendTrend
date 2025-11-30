<script setup lang="ts">
const primaryClass = 'bg-gray-200 px-3.5 py-1.5 rounded-md hover:bg-gray-200/50'
const textClass = 'text-sm font-medium text-gray-900 bg-transparent'
const secondaryClass = 'bg-transparent px-3.5 py-1.5 rounded-md hover:bg-gray-200 w-fit'
const classMap = {
  primary: primaryClass,
  text: textClass,
  secondary: secondaryClass,
  empty: '',
}
const { classToAdd, type = 'primary' } = defineProps<{
  classToAdd?: string
  type?: keyof typeof classMap
}>()

const defaultClass = 'cursor-pointer'
const buttonClass = defaultClass + ' ' + (classToAdd || '') + ' ' + (classMap[type] || '')
</script>
<template>
  <button :class="buttonClass"><slot></slot></button>
</template>
