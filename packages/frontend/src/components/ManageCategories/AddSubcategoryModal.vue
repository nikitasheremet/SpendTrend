<script lang="ts" setup>
import Modal from '../DesignSystem/Modal/Modal.vue'
import Input from '../DesignSystem/Input.vue'
import type { ExpenseCategory, ExpenseSubCategory } from '@/types/expenseData'
import { useAddSubCategory } from './hooks/useAddSubCategory'
import Error from '../DesignSystem/Error.vue'
import { computed, watch } from 'vue'
import Spinner from '../DesignSystem/Spinner.vue'
import Button from '../DesignSystem/Button/Button.vue'

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
  <Modal
    class="w-9/10"
    :is-modal-open="isOpen"
    @modal-closed="closeAddSubCategoryModal"
    close-text="X"
  >
    <div v-if="loading" class="flex flex-col items-center gap-4">
      <Spinner />
      <p>Adding subcategory...</p>
    </div>
    <div v-else class="flex flex-col gap-4">
      <p>Enter new Subcategory name:</p>
      <Input type="text" v-model="newSubCategoryValue" />
      <Button @click="handleAddSubCategory" :disabled="isSaveDisabled">Save Subcategory</Button>
      <Error v-if="error" :error="error" />
    </div>
  </Modal>
</template>

<style scoped></style>
