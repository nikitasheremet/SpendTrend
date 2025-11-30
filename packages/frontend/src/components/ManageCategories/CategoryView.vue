<script lang="ts" setup>
import { ref } from 'vue'
import AddSubcategoryModal from '@/components/ManageCategories/AddSubcategoryModal.vue'
import type { ExpenseCategory } from '@/types/expenseData'
import { useDeleteCategory } from './hooks/useDeleteCategory'
import SubCategoryView from './SubcategoryView.vue'
import { useManageSubCategories } from './hooks/useManageSubcategories'
import { useControlModal } from '../DesignSystem/Modal/useControlModal'
import { useControlCategoryOptions } from './hooks/useControlCategoryOptions'
import Error from '../DesignSystem/Error.vue'
import Button from '../DesignSystem/Button/Button.vue'

const { category } = defineProps<{
  category: ExpenseCategory
}>()

const emits = defineEmits<{
  categoryDeleted: [ExpenseCategory]
}>()
function categoryDeleted() {
  emits('categoryDeleted', category)
}
const { deleteCategory, error: deleteCategoryError } = useDeleteCategory(category, categoryDeleted)

const {
  subCategories,
  deleteSubCategory,
  subCategoryAdded,
  error: deleteSubCategoryError,
} = useManageSubCategories(category)

const { isModalOpen: isAddSubCategoryModalOpen, openModal: openAddSubCategoryModal } =
  useControlModal()

const { isOptionsOpen, toggleOptions, closeOptions } = useControlCategoryOptions()

const showSubCategories = ref(false)
function handleCategoryClick() {
  showSubCategories.value = !showSubCategories.value
}

const categoryOptions = [
  { name: 'Add SubCategory', action: openAddSubCategoryModal },
  { name: 'Delete Category', action: deleteCategory },
]

const error = deleteCategoryError || deleteSubCategoryError
</script>

<template>
  <div>
    <div>
      <span class="relative flex items-center">
        <p
          @click="handleCategoryClick"
          class="inline mr-2.5"
          :class="{ 'cursor-pointer': subCategories.length }"
        >
          {{ category.name }}
          <span v-if="subCategories.length" class="text-xs">{{
            showSubCategories ? '▼' : '▶'
          }}</span>
        </p>
        <Button type="secondary" class="text-xs p-1!" @click="toggleOptions" @blur="closeOptions"
          >⋮</Button
        >
        <div
          class="category-options absolute top-8 left-0 z-1000 bg-gray-50 flex flex-col gap-1 w-38 shadow-xs border"
          v-if="isOptionsOpen"
        >
          <span
            v-for="option in categoryOptions"
            :key="option.name"
            class="hover:bg-gray-200 px-3.5 py-1.5 rounded-md"
          >
            <Button :key="option.name" type="text" @click="option.action">
              {{ option.name }}
            </Button>
          </span>
        </div>
      </span>
    </div>
    <SubCategoryView
      v-if="showSubCategories"
      :subCategories="subCategories"
      @sub-category-delete-clicked="deleteSubCategory"
    />
  </div>
  <AddSubcategoryModal
    :category="category"
    v-model="isAddSubCategoryModalOpen"
    @sub-category-added="subCategoryAdded"
  />
  <Error v-if="error" :error="error" />
</template>

<style scoped></style>
