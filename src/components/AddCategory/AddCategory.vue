<script setup lang="ts">
import Modal from '@/components/Modal/Modal.vue'
import { removeDuplicates } from '@/helpers/removeDuplicates'
import { computed, ref } from 'vue'
import { store } from '@/store/store'

const isAddCategoryModalOpen = ref(false)
const newCategoryValue = ref('')
const isSaveCategoryDisabled = computed(() => Boolean(!newCategoryValue.value))

function handleAddCategory() {
  openAddCategoryModal()
}
function openAddCategoryModal() {
  isAddCategoryModalOpen.value = true
}
function closeAddCategoryModal() {
  isAddCategoryModalOpen.value = false
}
function saveCategory() {
  const newCategories = removeDuplicates(
    newCategoryValue.value.split(',').map((newCategory) => newCategory.trim()),
  )
  store.addCategories(newCategories)
  newCategoryValue.value = ''
  closeAddCategoryModal()
}
</script>

<template>
  <button @click="handleAddCategory">Add Category</button>
  <Modal :is-modal-open="isAddCategoryModalOpen" @modal-closed="closeAddCategoryModal">
    <input
      id="add-category-input"
      type="text"
      placeholder="Multiple categories can be added seperated by commas"
      v-model="newCategoryValue"
    />
    <button @click="saveCategory" :disabled="isSaveCategoryDisabled">Save Category</button>
  </Modal>
</template>

<style scoped>
#add-category-input {
  width: 350px;
  margin-right: 16px;
}
</style>
