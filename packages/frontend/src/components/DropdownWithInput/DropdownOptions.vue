<script lang="ts" setup>
const { options, optionsStyle } = defineProps<{
  options: string[]
  optionsStyle: {
    top: string
    left: string
    width: string
  }
}>()
const emits = defineEmits<{
  dropdownOptionClick: [option: string]
}>()

function optionClicked(option: string) {
  emits('dropdownOptionClick', option)
}
</script>

<template>
  <div
    class="dropdown-options fixed z-2000 bg-white border p-1 max-h-[200px] overflow-y-auto shadow-xs"
    :style="optionsStyle"
  >
    <div
      v-for="option of options"
      :key="option"
      class="p-1 hover:bg-gray-100/50 whitespace-normal wrap-break-word"
      @mousedown.stop="optionClicked(option)"
    >
      <span>{{ option }}</span>
    </div>
  </div>
</template>

<style></style>
