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

const error = deleteCategoryError || deleteSubCategoryError
</script>

<template>
  <div>
    <div>
      <span style="position: relative">
        <p
          @click="handleCategoryClick"
          style="display: inline; margin-right: 10px; cursor: pointer"
        >
          {{ category.name }}
        </p>
        <button style="font-size: 8px" @click="toggleOptions" @blur="closeOptions">Options</button>
        <div class="category-options" v-if="isOptionsOpen">
          <button @click="openAddSubCategoryModal">Add SubCategory</button>
          <button @click="deleteCategory">Delete Category</button>
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

<style scoped>
.category-options {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
}
</style>
