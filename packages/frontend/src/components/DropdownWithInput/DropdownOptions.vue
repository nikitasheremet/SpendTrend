<script lang="ts" setup>
const { options } = defineProps<{ options: string[] }>()
const emits = defineEmits<{
  dropdownOptionClick: [option: string]
}>()

function optionClicked(option: string) {
  emits('dropdownOptionClick', option)
}
</script>

<template>
  <div class="absolute z-2000 bg-white w-full border p-1 top-[calc(100%+1px)]">
    <div
      class="p-1 hover:bg-gray-100/50"
      v-for="option of options"
      :key="option"
      @click.stop="optionClicked(option)"
    >
      <span>{{ option }}</span>
    </div>
  </div>
</template>

<style></style>
