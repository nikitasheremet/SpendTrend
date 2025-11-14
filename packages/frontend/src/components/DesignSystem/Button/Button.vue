<script setup lang="ts">
const { classToAdd } = defineProps<{
  classToAdd: string
}>()

const defaultClass = 'cursor-pointer'
const buttonClass = defaultClass + ' ' + classToAdd
</script>
<template>
  <button :class="buttonClass"><slot></slot></button>
</template>
