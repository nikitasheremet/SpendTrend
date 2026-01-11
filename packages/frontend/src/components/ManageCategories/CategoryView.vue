<script lang="ts" setup>
import { ref } from 'vue'
import { Teleport } from 'vue'
import AddSubcategoryModal from '@/components/ManageCategories/AddSubcategoryModal.vue'
import UpdateNameModal from '@/components/ManageCategories/UpdateNameModal.vue'
import type { ExpenseCategory } from '@/types/expenseData'
import { useDeleteCategory } from './hooks/useDeleteCategory'
import { useUpdateCategory } from './hooks/useUpdateCategory'
import SubCategoryView from './SubcategoryView.vue'
import { useManageSubCategories } from './hooks/useManageSubcategories'
import { useControlModal } from '../DesignSystem/Modal/useControlModal'
import { useControlCategoryOptions } from './hooks/useControlCategoryOptions'
import { useDropdownPosition } from '@/helpers/hooks/useDropdownPosition'
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
  updateCategory,
  error: updateCategoryError,
  loading: updateCategoryLoading,
} = useUpdateCategory(category)

const {
  subCategories,
  deleteSubCategory,
  subCategoryAdded,
  updateSubCategory,
  error: deleteSubCategoryError,
  loading: subCategoryLoading,
} = useManageSubCategories(category)

const { isModalOpen: isAddSubCategoryModalOpen, openModal: openAddSubCategoryModal } =
  useControlModal()
const { isModalOpen: isUpdateCategoryModalOpen, openModal: openUpdateCategoryModal } =
  useControlModal()

const {
  isOptionsOpen,
  toggleOptions: originalToggleOptions,
  closeOptions,
} = useControlCategoryOptions()

const { optionsTop, optionsLeft, positionDropdown } = useDropdownPosition()

async function toggleOptions() {
  originalToggleOptions()
  await positionDropdown(isOptionsOpen.value)
}

const showSubCategories = ref(false)
function handleCategoryClick() {
  showSubCategories.value = !showSubCategories.value
}

async function handleUpdateCategory(newName: string) {
  await updateCategory(newName)
  if (!updateCategoryError.value) {
    isUpdateCategoryModalOpen.value = false
  }
}

const categoryOptions = [
  { name: 'Update Category', action: openUpdateCategoryModal },
  { name: 'Add SubCategory', action: openAddSubCategoryModal },
  { name: 'Delete Category', action: deleteCategory },
]

const error = deleteCategoryError || deleteSubCategoryError || updateCategoryError
</script>

<template>
  <div>
    <div>
      <span ref="optionsRef" class="relative flex items-center">
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
        <Teleport to="body">
          <div
            ref="optionsDivRef"
            class="category-options fixed z-10000 bg-gray-50 flex flex-col gap-1 w-38 shadow-xs border"
            :style="{ top: optionsTop + 'px', left: optionsLeft + 'px' }"
            v-if="isOptionsOpen"
          >
            <span
              v-for="option in categoryOptions"
              :key="option.name"
              class="hover:bg-gray-200 px-3.5 py-1.5 rounded-md"
            >
              <Button :key="option.name" type="text" @mousedown="option.action">
                {{ option.name }}
              </Button>
            </span>
          </div>
        </Teleport>
      </span>
    </div>
    <SubCategoryView
      v-if="showSubCategories"
      :subCategories="subCategories"
      :loading="subCategoryLoading"
      @sub-category-delete-clicked="deleteSubCategory"
      @sub-category-update="updateSubCategory"
    />
  </div>
  <AddSubcategoryModal
    :category="category"
    v-model="isAddSubCategoryModalOpen"
    @sub-category-added="subCategoryAdded"
  />
  <UpdateNameModal
    title="Update the category name"
    :current-name="category.name"
    :loading="updateCategoryLoading"
    v-model="isUpdateCategoryModalOpen"
    @update="handleUpdateCategory"
  />
  <Error v-if="error" :error="error" />
</template>

<style scoped></style>
