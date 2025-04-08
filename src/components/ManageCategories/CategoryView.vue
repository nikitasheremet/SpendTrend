<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import AddSubcategoryModal from '@/components/ManageCategories/AddSubcategoryModal.vue'
import { sleep } from '@/helpers/sleep'
import { store } from '@/store/store'
import type { Category } from '@/types/expenseData'
import { useDeleteCategory } from './hooks/useDeleteCategory'
import SubcategoryView from './SubcategoryView.vue'
import { useManageSubcategories } from './hooks/useManageSubcategories'
import { useControlModal } from '../DesignSystem/Modal/useControlModal'
const { category } = defineProps<{
  category: Category
}>()
const emits = defineEmits<{
  categoryDeleted: [Category]
}>()

function categoryDeleted() {
  emits('categoryDeleted', category)
}

const { deleteCategory, error: deleteCategoryError } = useDeleteCategory(category, categoryDeleted)
const { subcategories, deleteSubcategory } = useManageSubcategories(category)

const { isModalOpen, openModal, closeModal } = useControlModal()

const showSubcategories = ref(false)
function handleCategoryClick() {
  showSubcategories.value = !showSubcategories.value
}

const isCategoryOptionsShown = ref(false)
function showCategoryOptions() {
  isCategoryOptionsShown.value = !isCategoryOptionsShown.value
}
async function closeCategoryOptions() {
  const ONE_HUNDRED_MS_TO_ALLOW_MODAL_TO_OPEN = 100
  await sleep(ONE_HUNDRED_MS_TO_ALLOW_MODAL_TO_OPEN)
  await nextTick()
  isCategoryOptionsShown.value = false
}
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
        <button style="font-size: 8px" @click="showCategoryOptions" @blur="closeCategoryOptions">
          Options
        </button>
        <div class="category-options" v-if="isCategoryOptionsShown">
          <button @click="openModal">Add Subcategory</button>
          <button @click="deleteCategory">Delete Category</button>
        </div>
      </span>
    </div>
    <SubcategoryView
      :subcategories="subcategories"
      @subcategory-delete-clicked="deleteSubcategory"
    />
  </div>
  <AddSubcategoryModal :category-name="category.name" v-model="isModalOpen" />
  <Error v-if="deleteCategoryError" :error="deleteCategoryError" />
</template>

<style scoped>
.category-options {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
}
</style>
