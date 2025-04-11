<script lang="ts" setup>
import AddExpenseCell from './AddExpenseCell.vue'
import { store } from '@/store/store'
import { computed, onMounted, ref } from 'vue'
import type { NewExpenseData } from './AddExpenseTable.vue'
import { getCategories } from '@/service/categories/getCategories'
import type { Category } from '@/types/expenseData'

const newExpenseData = defineModel<NewExpenseData>({ required: true })

const categories = ref<Category[]>([])

onMounted(() => {
  getCategories().then((response) => {
    categories.value = response
  })
})

const categoryNames = computed(() => {
  return categories.value.map((category) => category.name)
})
function getSubcategories() {
  const selectedCategory = newExpenseData.value.category
  const selectedCategoryObject = categories.value.find(
    (category) => category.name === selectedCategory,
  )
  if (selectedCategoryObject) {
    return selectedCategoryObject.subcategories
  }
  return []
}
</script>

<template>
  <AddExpenseCell type="date" v-model="newExpenseData.date" />
  <AddExpenseCell v-model="newExpenseData.name" />
  <td>{{ newExpenseData.netAmount }}</td>
  <AddExpenseCell type="number" v-model="newExpenseData.amount" />
  <AddExpenseCell type="number" v-model="newExpenseData.paidBackAmount" />
  <AddExpenseCell
    type="dropdown"
    v-model="newExpenseData.category"
    :dropdown-options="categoryNames"
  />
  <AddExpenseCell
    type="dropdown"
    v-model="newExpenseData.subCategory"
    :dropdown-options="getSubcategories()"
  />
</template>

<style scoped></style>
