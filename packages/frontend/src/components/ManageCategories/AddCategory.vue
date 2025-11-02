<script setup lang="ts">
import Modal from '../DesignSystem/Modal/Modal.vue'
import { computed } from 'vue'
import { useControlModal } from '../DesignSystem/Modal/useControlModal'
import type { ExpenseCategory } from '@/types/expenseData'
import { useAddCategory } from './hooks/useAddCategory'
import Error from '../DesignSystem/Error.vue'
import Input from '../DesignSystem/Input.vue'

const { isModalOpen: isAddCategoryModalOpen, openModal, closeModal } = useControlModal()

const emits = defineEmits<{
  categoryAdded: [ExpenseCategory]
}>()

const { newCategoriesValue, addCategory, error } = useAddCategory()

const isSaveCategoryDisabled = computed(() => Boolean(!newCategoriesValue.value))

function handleAddCategory() {
  openModal()
}
</script>

<template>
  <button @click="handleAddCategory">Add Category</button>
  <Modal :is-modal-open="isAddCategoryModalOpen" @modal-closed="closeModal">
    <Input id="add-category-input" type="text" v-model="newCategoriesValue" />
    <button @click="addCategory" :disabled="isSaveCategoryDisabled">Save Category</button>
    <Error v-if="error" :error="error" />
  </Modal>
</template>

<style scoped>
#add-category-input {
  width: 350px;
  margin-right: 16px;
}
</style>
