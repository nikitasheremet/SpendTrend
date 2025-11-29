<script lang="ts" setup>
import Modal from '../DesignSystem/Modal/Modal.vue'
import Input from '../DesignSystem/Input.vue'
import type { ExpenseCategory, ExpenseSubCategory } from '@/types/expenseData'
import { useAddSubCategory } from './hooks/useAddSubCategory'
import Error from '../DesignSystem/Error.vue'
import { computed, watch } from 'vue'
import Spinner from '../DesignSystem/Spinner.vue'

const isOpen = defineModel<boolean>({ required: true })
const { category } = defineProps<{
  category: ExpenseCategory
}>()

const emits = defineEmits<{
  subCategoryAdded: [ExpenseSubCategory]
}>()

const { newSubCategoryValue, addSubCategory, error, loading } = useAddSubCategory(category)

const isSaveDisabled = computed(() => !newSubCategoryValue.value.trim() || loading.value)

watch(loading, (newVal) => {
  if (!newVal && !error.value) {
    closeAddSubCategoryModal()
  }
})

async function handleAddSubCategory() {
  await addSubCategory()
}

function closeAddSubCategoryModal() {
  isOpen.value = false
}
</script>

<template>
  <Modal :is-modal-open="isOpen" @modal-closed="closeAddSubCategoryModal">
    <div v-if="loading" class="flex flex-col items-center gap-4">
      <Spinner />
      <p>Adding subcategory...</p>
    </div>
    <div v-else>
      <Input type="text" placeholder="Subcategory name" v-model="newSubCategoryValue" />
      <button @click="handleAddSubCategory" :disabled="isSaveDisabled">Save Subcategory</button>
      <Error v-if="error" :error="error" />
    </div>
  </Modal>
</template>

<style scoped></style>
