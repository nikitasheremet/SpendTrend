<script lang="ts" setup>
import { ref } from 'vue'
import { ExpenseSubCategory } from '@/types/expenseData'
import Button from '../DesignSystem/Button/Button.vue'
import UpdateNameModal from './UpdateNameModal.vue'
import { useControlModal } from '../DesignSystem/Modal/useControlModal'

const { subCategories, loading } = defineProps<{
  subCategories: ExpenseSubCategory[]
  loading?: boolean
}>()

const emits = defineEmits<{
  subCategoryDeleteClicked: [ExpenseSubCategory]
  subCategoryUpdate: [string, string]
}>()

const activeOptionsSubCategoryId = ref<string | null>(null)
const selectedSubCategoryForUpdate = ref<ExpenseSubCategory | null>(null)
const { isModalOpen: isUpdateSubCategoryModalOpen, openModal: openUpdateSubCategoryModal } =
  useControlModal()

function toggleOptions(subCategoryId: string) {
  if (activeOptionsSubCategoryId.value === subCategoryId) {
    activeOptionsSubCategoryId.value = null
  } else {
    activeOptionsSubCategoryId.value = subCategoryId
  }
}

function closeOptions() {
  activeOptionsSubCategoryId.value = null
}

function openUpdateModal(subCategory: ExpenseSubCategory) {
  selectedSubCategoryForUpdate.value = subCategory
  openUpdateSubCategoryModal()
  closeOptions()
}

function handleUpdateSubCategory(newName: string) {
  if (selectedSubCategoryForUpdate.value) {
    emits('subCategoryUpdate', selectedSubCategoryForUpdate.value.id, newName)
    isUpdateSubCategoryModalOpen.value = false
  }
}

function handleDeleteSubCategory(subCategory: ExpenseSubCategory) {
  emits('subCategoryDeleteClicked', subCategory)
  closeOptions()
}

const subCategoryOptions = (subCategory: ExpenseSubCategory) => [
  { name: 'Update SubCategory', action: () => openUpdateModal(subCategory) },
  { name: 'Delete SubCategory', action: () => handleDeleteSubCategory(subCategory) },
]
</script>

<template>
  <ul class="ml-10 mb-5">
    <li v-for="subCategory in subCategories" :key="subCategory.id">
      <div class="my-2.5">
        <span class="relative flex items-center">
          <p style="display: inline; margin-right: 10px">{{ subCategory.name }}</p>
          <Button type="secondary" class="text-xs p-1!" @click="toggleOptions(subCategory.id)"
            >⋮</Button
          >
          <div
            class="subcategory-options absolute top-8 left-0 z-1000 bg-gray-50 flex flex-col gap-1 w-38 shadow-xs border"
            v-if="activeOptionsSubCategoryId === subCategory.id"
          >
            <span
              v-for="option in subCategoryOptions(subCategory)"
              :key="option.name"
              class="hover:bg-gray-200 px-3.5 py-1.5 rounded-md"
            >
              <Button type="text" @click="option.action">
                {{ option.name }}
              </Button>
            </span>
          </div>
        </span>
      </div>
    </li>
  </ul>
  <UpdateNameModal
    v-if="selectedSubCategoryForUpdate"
    title="Update the subcategory name"
    :current-name="selectedSubCategoryForUpdate.name"
    :loading="loading"
    v-model="isUpdateSubCategoryModalOpen"
    @update="handleUpdateSubCategory"
  />
</template>

<style scoped></style>
