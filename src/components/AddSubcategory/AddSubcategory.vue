<script setup lang="ts">
import Modal from '@/components/Modal/Modal.vue'
import { removeDuplicates } from '@/helpers/removeDuplicates'
import { computed, ref } from 'vue'
import { store } from '@/store/store'

const isAddSubcategoryModalOpen = ref(false)
const newSubcategoryValue = ref('')
const isSaveSubcategoryDisabled = computed(() => Boolean(!newSubcategoryValue.value))

function handleAddSubcategory() {
  openAddSubcategoryModal()
}
function openAddSubcategoryModal() {
  isAddSubcategoryModalOpen.value = true
}
function closeAddSubcategoryModal() {
  isAddSubcategoryModalOpen.value = false
}
function clearInput() {
  newSubcategoryValue.value = ''
}
function saveSubcategory() {
  const newSubcategories = removeDuplicates(
    newSubcategoryValue.value.split(',').map((newSubcategory) => newSubcategory.trim()),
  )
  store.addSubcategories(newSubcategories)
  clearInput()
  closeAddSubcategoryModal()
}
</script>

<template>
  <button @click="handleAddSubcategory">Add Subcategory</button>
  <Modal :is-modal-open="isAddSubcategoryModalOpen" @modal-closed="closeAddSubcategoryModal">
    <input
      id="add-subcategory-input"
      type="text"
      placeholder="Multiple sub categories can be added seperated by commas"
      v-model="newSubcategoryValue"
    />
    <button @click="saveSubcategory" :disabled="isSaveSubcategoryDisabled">Save Subcategory</button>
  </Modal>
</template>

<style scoped>
#add-subcategory-input {
  width: 350px;
  margin-right: 16px;
}
</style>
