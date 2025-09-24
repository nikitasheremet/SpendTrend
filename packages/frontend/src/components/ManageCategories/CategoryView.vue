<script lang="ts" setup>
import { ref } from 'vue'
// import AddSubcategoryModal from '@/components/ManageCategories/AddSubcategoryModal.vue'
import type { ExpenseCategory } from '@/types/expenseData'
import { useDeleteCategory } from './hooks/useDeleteCategory'
import SubcategoryView from './SubcategoryView.vue'
import { useManageSubcategories } from './hooks/useManageSubcategories'
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
  subcategories,
  deleteSubcategory,
  // subcategoriesAdded,
  error: deleteSubcategoryError,
  // @ts-expect-error - REMOVE THIS AFTER SUBCATEGORIES ENDPOINTS ARE READY
} = useManageSubcategories(category)

// eslint-disable-next-line
const { isModalOpen, openModal: openAddSubcategoryModal } = useControlModal()

const { isOptionsOpen, toggleOptions, closeOptions } = useControlCategoryOptions()

const showSubcategories = ref(false)
function handleCategoryClick() {
  showSubcategories.value = !showSubcategories.value
}

const error = deleteCategoryError || deleteSubcategoryError
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
          <button @click="openAddSubcategoryModal">Add Subcategory</button>
          <button @click="deleteCategory">Delete Category</button>
        </div>
      </span>
    </div>
    <SubcategoryView
      v-if="showSubcategories"
      :subcategories="subcategories"
      @subcategory-delete-clicked="deleteSubcategory"
    />
  </div>
  <!-- <AddSubcategoryModal
    :category="category"
    v-model="isAddSubcategoryModalOpen"
    @subcategories-added="subcategoriesAdded"
  /> -->
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
