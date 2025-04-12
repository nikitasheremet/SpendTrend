<script lang="ts" setup>
const { subcategories } = defineProps<{
  subcategories: string[]
}>()
const emits = defineEmits<{
  subcategoryDeleteClicked: [string]
}>()
</script>

<template>
  <ul>
    <li v-for="subcategory in subcategories" :key="subcategory">
      <div style="margin: 10px 0 10px 0">
        <p style="display: inline; margin-right: 10px">{{ subcategory }}</p>
        <button
          style="font-size: 8px"
          @click="() => emits('subcategoryDeleteClicked', subcategory)"
        >
          Delete
        </button>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.subcategory-wrapper {
  margin: 10px 0 10px 0;
}
.subcategory-text {
  display: inline;
  margin-right: 10px;
}
.subcategory-delete-button {
  font-size: 8px;
}
</style>
