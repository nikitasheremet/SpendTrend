<script lang="ts" setup>
defineProps<{ options: string[] }>()
defineEmits(['dropdownOptionClick'])
</script>

<template>
  <div class="bg-red-50">
    <div class="dropdown-options" v-for="option of options">
      <span @click="$emit('dropdownOptionClick', option)">{{ option }}</span>
    </div>
  </div>
</template>

<style>
.dropdown-options {
  color: black;
}
.options {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background-color: black;
}
</style>
