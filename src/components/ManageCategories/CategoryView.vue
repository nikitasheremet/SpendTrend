<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import AddSubcategoryModal from '@/components/ManageCategories/AddSubcategoryModal.vue'
import { sleep } from '@/helpers/sleep'
import { store } from '@/store/store'
import type { Category } from '@/types/expenseData'
import { useDeleteCategory } from './hooks/useDeleteCategory'
const { category } = defineProps<{
  category: Category
}>()
const emits = defineEmits<{
  categoryDeleted: [Category]
}>()

const localSubcategories = ref(category.subcategories)

function categoryDeleted() {
  emits('categoryDeleted', category)
}

const { deleteCategory, error: deleteCategoryError } = useDeleteCategory(category, categoryDeleted)

const isAddSubcategoryModalOpen = ref(false)
function handleAddSubcategoryClicked() {
  isAddSubcategoryModalOpen.value = true
}
watch(isAddSubcategoryModalOpen, (newValue) => {
  if (newValue === false) {
    emits('categoriesUpdated')
  }
})

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

function handleSubcategoryDelete(subcategoryToDelete: string) {
  let isDeleteConfirmed = window.confirm(
    'Are you sure you want to delete this subcategory? It will remove this subcategory from all expenses. You will need to manually re-categorize them if desired. This action cannot be undone.',
  )
  if (isDeleteConfirmed) {
    store.deleteSubcategory(subcategoryToDelete, category.name)
    localSubcategories.value = localSubcategories.value.filter(
      (subcategory) => subcategory !== subcategoryToDelete,
    )
    emits('categoriesUpdated')
  } else {
    console.log('Deletion canceled.')
  }
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
          <button @click="handleAddSubcategoryClicked">Add Subcategory</button>
          <button @click="deleteCategory">Delete Category</button>
        </div>
      </span>
    </div>
    <ul v-if="showSubcategories && Boolean(localSubcategories.length)">
      <li v-for="subcategory in localSubcategories" :key="subcategory">
        <div style="margin: 10px 0 10px 0">
          <p style="display: inline; margin-right: 10px">{{ subcategory }}</p>
          <button style="font-size: 8px" @click="() => handleSubcategoryDelete(subcategory)">
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
  <AddSubcategoryModal :category-name="category.name" v-model="isAddSubcategoryModalOpen" />
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
