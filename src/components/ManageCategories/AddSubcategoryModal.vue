<script lang="ts" setup>
import Modal from '../DesignSystem/Modal/Modal.vue'
import Input from '../DesignSystem/Input.vue'
import type { Category } from '@/types/expenseData'
import { useAddSubcategory } from './hooks/useAddSubcategory'
import Error from '../DesignSystem/Error.vue'

const isOpen = defineModel<boolean>({ required: true })
const { category } = defineProps<{
  category: Category
}>()

const emits = defineEmits<{
  subcategoriesAdded: [string[]]
}>()
function subcategoriesAdded(subcategories: string[]) {
  emits('subcategoriesAdded', subcategories)
}
const { newSubcategoriesValue, addSubcategory, error } = useAddSubcategory(
  category,
  subcategoriesAdded,
)

function closeAddSubcategoryModal() {
  isOpen.value = false
}
</script>

<template>
  <Modal :is-modal-open="isOpen" @modal-closed="closeAddSubcategoryModal">
    <Input type="text" placeholder="Subcategory name" v-model="newSubcategoriesValue" />
    <button @click="addSubcategory">Save Subcategory</button>
    <Error v-if="error" :error="error" />
  </Modal>
</template>

<style scoped></style>
