<script lang="ts" setup>
import { ref } from 'vue'
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
import { useClickOutside } from '@/helpers/hooks/useClickOutside'
import Error from '../DesignSystem/Error.vue'
import Button from '../DesignSystem/Button/Button.vue'

const { category } = defineProps<{
  category: ExpenseCategory
}>()

const { deleteCategory, error: deleteCategoryError } = useDeleteCategory(category)
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

const optionsRef = ref<HTMLElement>()
const optionsDivRef = ref<HTMLElement>()

const { optionsTop, optionsLeft, positionDropdown } = useDropdownPosition(optionsRef, optionsDivRef)

// ignoreSelector on the toggle button itself is required, not optional: the click that opens
// the dropdown is dispatched from the toggle button, which is never a DOM descendant of the
// (freshly created) dropdown container - so without excluding it, that same click's bubble to
// document reads as "outside" and immediately closes the dropdown it just opened.
useClickOutside(optionsDivRef, () => isOptionsOpen.value, closeOptions, {
  ignoreSelector: '[data-category-options-toggle]',
})

async function toggleOptions() {
  originalToggleOptions()
  await positionDropdown(isOptionsOpen.value)
}

function selectOption(action: () => void) {
  action()
  closeOptions()
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
          class="inline mr-2.5"
          :class="{ 'cursor-pointer': subCategories.length }"
          @click="handleCategoryClick"
        >
          {{ category.name }}
          <span v-if="subCategories.length" class="text-xs">{{
            showSubCategories ? '▼' : '▶'
          }}</span>
        </p>
        <Button
          data-category-options-toggle
          type="secondary"
          class="text-xs p-1!"
          @click="toggleOptions"
          >⋮</Button
        >
        <Teleport to="body">
          <div
            v-if="isOptionsOpen"
            ref="optionsDivRef"
            data-manage-categories-portal
            class="category-options fixed z-10000 bg-gray-50 flex flex-col gap-1 w-38 shadow-xs border"
            :style="{ top: optionsTop + 'px', left: optionsLeft + 'px' }"
          >
            <span
              v-for="option in categoryOptions"
              :key="option.name"
              class="hover:bg-gray-200 px-3.5 py-1.5 rounded-md"
            >
              <Button :key="option.name" type="text" @click="selectOption(option.action)">
                {{ option.name }}
              </Button>
            </span>
          </div>
        </Teleport>
      </span>
    </div>
    <SubCategoryView
      v-if="showSubCategories"
      :sub-categories="subCategories"
      :loading="subCategoryLoading"
      @sub-category-delete-clicked="deleteSubCategory"
      @sub-category-update="updateSubCategory"
    />
  </div>
  <AddSubcategoryModal
    v-model="isAddSubCategoryModalOpen"
    :category="category"
    @sub-category-added="subCategoryAdded"
  />
  <UpdateNameModal
    v-model="isUpdateCategoryModalOpen"
    title="Update the category name"
    :current-name="category.name"
    :loading="updateCategoryLoading"
    @update="handleUpdateCategory"
  />
  <Error v-if="error" :error="error" />
</template>

<style scoped></style>
