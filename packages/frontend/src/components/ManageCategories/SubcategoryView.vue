<script lang="ts" setup>
import { ExpenseSubCategory } from '@/types/expenseData'

const { subCategories } = defineProps<{
  subCategories: ExpenseSubCategory[]
}>()
const emits = defineEmits<{
  subCategoryDeleteClicked: [ExpenseSubCategory]
}>()
</script>

<template>
  <ul>
    <li v-for="subCategory in subCategories" :key="subCategory.id">
      <div style="margin: 10px 0 10px 0">
        <p style="display: inline; margin-right: 10px">{{ subCategory.name }}</p>
        <button
          style="font-size: 8px"
          @click="() => emits('subCategoryDeleteClicked', subCategory)"
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
