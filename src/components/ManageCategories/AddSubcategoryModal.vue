<script lang="ts" setup>
import { ref } from 'vue'
import Modal from '../DesignSystem/Modal/Modal.vue'
import { store } from '@/store/store'
import Input from '../DesignSystem/Input.vue'

const isOpen = defineModel<boolean>({ required: true })
const { categoryName } = defineProps<{
  categoryName: string
}>()

const newSubcategoryNames = ref<string>('')

function closeAddSubcategoryModal() {
  isOpen.value = false
}

function saveSubcategory() {
  const newSubscategories = newSubcategoryNames.value
    .split(',')
    .map((newSubcategory) => newSubcategory.trim())
  store.addSubcategoriesToCategory(newSubscategories, categoryName)

  newSubcategoryNames.value = ''
  isOpen.value = false
}
</script>

<template>
  <Modal :is-modal-open="isOpen" @modal-closed="closeAddSubcategoryModal">
    <Input type="text" placeholder="Subcategory name" v-model="newSubcategoryNames" />
    <button @click="saveSubcategory">Save Subcategory</button>
  </Modal>
</template>

<style scoped></style>
