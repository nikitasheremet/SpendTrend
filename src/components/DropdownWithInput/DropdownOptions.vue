<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
defineProps<{
  options: string[]
}>()
defineEmits(['dropdownOptionClick'])
</script>

<template>
  <div class="dropdown-options" v-for="option of options">
    <span @click="$emit('dropdownOptionClick', option)">{{ option }}</span>
  </div>
</template>

<style>
.dropdown-options {
  color: white;
}
</style>
