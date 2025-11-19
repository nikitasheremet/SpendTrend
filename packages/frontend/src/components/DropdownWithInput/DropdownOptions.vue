<script lang="ts" setup>
defineProps<{ options: string[] }>()
defineEmits(['dropdownOptionClick'])
</script>

<template>
  <div class="absolute z-2000 bg-white w-full border p-1">
    <div
      class="p-1 hover:bg-gray-100/50"
      v-for="option of options"
      @click="$emit('dropdownOptionClick', option)"
    >
      <span>{{ option }}</span>
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
