<script setup lang="ts">
import Modal from '../DesignSystem/Modal/Modal.vue'
import { computed, watch } from 'vue'
import { useControlModal } from '../DesignSystem/Modal/useControlModal'
import type { ExpenseCategory } from '@/types/expenseData'
import { useAddCategory } from './hooks/useAddCategory'
import Error from '../DesignSystem/Error.vue'
import Input from '../DesignSystem/Input.vue'
import Spinner from '../DesignSystem/Spinner.vue'
import Button from '../DesignSystem/Button/Button.vue'

const { isModalOpen: isAddCategoryModalOpen, openModal, closeModal } = useControlModal()

const emits = defineEmits<{
  categoryAdded: [ExpenseCategory]
}>()

const { newCategoriesValue, addCategory, error, loading } = useAddCategory()

const isSaveCategoryDisabled = computed(() => !newCategoriesValue.value.trim() || loading.value)

watch(loading, (newVal) => {
  if (!newVal && !error.value) {
    closeModal()
  }
})

function handleAddCategory() {
  openModal()
}
</script>

<template>
  <Button class="mb-4" @click="handleAddCategory">Add Category</Button>
  <Modal
    class="w-9/10"
    :is-modal-open="isAddCategoryModalOpen"
    @modal-closed="closeModal"
    close-text="X"
  >
    <div v-if="loading" class="flex flex-col items-center gap-4">
      <Spinner />
      <p>Adding category...</p>
    </div>
    <div v-else class="flex flex-col gap-4">
      <p>Enter new Category name:</p>
      <Input id="add-category-input" type="text" v-model="newCategoriesValue" />
      <Button @click="addCategory" :disabled="isSaveCategoryDisabled">Save Category</Button>
      <Error v-if="error" :error="error" />
    </div>
  </Modal>
</template>

<style scoped>
#add-category-input {
  width: 350px;
  margin-right: 16px;
}
</style>
