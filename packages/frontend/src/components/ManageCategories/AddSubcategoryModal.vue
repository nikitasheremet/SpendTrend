<script lang="ts" setup>
import Modal from '../DesignSystem/Modal/Modal.vue'
import Input from '../DesignSystem/Input.vue'
import type { ExpenseCategory, ExpenseSubCategory } from '@/types/expenseData'
import { useAddSubCategory } from './hooks/useAddSubCategory'
import Error from '../DesignSystem/Error.vue'

const isOpen = defineModel<boolean>({ required: true })
const { category } = defineProps<{
  category: ExpenseCategory
}>()

const emits = defineEmits<{
  subCategoryAdded: [ExpenseSubCategory]
}>()
function subCategoryAdded(subCategory: ExpenseSubCategory) {
  emits('subCategoryAdded', subCategory)
}
const { newSubCategoryValue, addSubCategory, error } = useAddSubCategory(category, subCategoryAdded)

async function handleAddSubCategory() {
  await addSubCategory()
  closeAddSubCategoryModal()
}

function closeAddSubCategoryModal() {
  isOpen.value = false
}
</script>

<template>
  <Modal :is-modal-open="isOpen" @modal-closed="closeAddSubCategoryModal">
    <Input type="text" placeholder="Subcategory name" v-model="newSubCategoryValue" />
    <button @click="handleAddSubCategory">Save Subcategory</button>
    <Error v-if="error" :error="error" />
  </Modal>
</template>

<style scoped></style>
