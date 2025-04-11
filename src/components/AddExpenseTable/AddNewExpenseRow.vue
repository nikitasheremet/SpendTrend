<script lang="ts" setup>
import AddExpenseCell from './AddExpenseCell.vue'
import { store } from '@/store/store'
import { computed, onMounted, ref } from 'vue'
import type { NewExpenseData } from './AddExpenseTable.vue'
import { getCategories } from '@/service/categories/getCategories'
import type { Category } from '@/types/expenseData'

const { newExpenseData } = defineProps<{
  newExpenseData: NewExpenseData
}>()
const emits = defineEmits<{
  updatedNewExpenseData: [NewExpenseData]
}>()

const localNewExpenseData = computed({
  get: () => newExpenseData,
  set: (value) => {
    emits('updatedNewExpenseData', {
      ...value,
      netAmount: (value.amount || 0) - (value.paidBackAmount || 0),
    })
  },
})

const netAmount = computed(() => {
  const { amount, paidBackAmount } = localNewExpenseData.value
  return (amount || 0) - (paidBackAmount || 0)
})

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
  const selectedCategory = localNewExpenseData.value.category
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
  <AddExpenseCell type="date" v-model="localNewExpenseData.date" />
  <AddExpenseCell v-model="localNewExpenseData.name" />
  <td>{{ netAmount }}</td>
  <AddExpenseCell type="number" v-model="localNewExpenseData.amount" />
  <AddExpenseCell type="number" v-model="localNewExpenseData.paidBackAmount" />
  <AddExpenseCell
    type="dropdown"
    v-model="localNewExpenseData.category"
    :dropdown-options="categoryNames"
  />
  <AddExpenseCell
    type="dropdown"
    v-model="localNewExpenseData.subCategory"
    :dropdown-options="getSubcategories()"
  />
</template>

<style scoped></style>
