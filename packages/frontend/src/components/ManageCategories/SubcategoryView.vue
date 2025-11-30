<script lang="ts" setup>
import { ExpenseSubCategory } from '@/types/expenseData'
import Button from '../DesignSystem/Button/Button.vue'

const { subCategories } = defineProps<{
  subCategories: ExpenseSubCategory[]
}>()
const emits = defineEmits<{
  subCategoryDeleteClicked: [ExpenseSubCategory]
}>()
</script>

<template>
  <ul class="ml-10 mb-5">
    <li v-for="subCategory in subCategories" :key="subCategory.id">
      <div class="my-2.5">
        <p style="display: inline; margin-right: 10px">{{ subCategory.name }}</p>
        <Button
          type="secondary"
          class="text-xs p-1!"
          @click="() => emits('subCategoryDeleteClicked', subCategory)"
        >
          🗑
        </Button>
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
