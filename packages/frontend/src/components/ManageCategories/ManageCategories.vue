<script lang="ts" setup>
import CategoryView from './CategoryView.vue'
import AddCategory from './AddCategory.vue'
import { useGetCategories } from './hooks/useGetCategories'
import Error from '../DesignSystem/Error.vue'

const { isOpen } = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  closeManageCategories: []
}>()

const { categories, error, newCategoriesAdded, categoryDeleted } = useGetCategories()
</script>

<template>
  <div id="manage-categories" :class="{ visible: isOpen }">
    <div id="manage-categories-header">
      <h2>Manage Categories</h2>
      <button @click="emit('closeManageCategories')">Close</button>
    </div>
    <AddCategory @category-added="newCategoriesAdded" />
    <ul>
      <li v-for="category in categories" :key="category.name">
        <CategoryView :category="category" @category-deleted="categoryDeleted" />
      </li>
    </ul>
  </div>
  <Error v-if="error" :error="error" />
</template>

<style scoped>
#manage-categories-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#manage-categories {
  background-color: #f9f9f9;
  z-index: 2000;
  padding: 20px;
  transition: opacity 0.3s ease;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  right: -20px;
  top: -20px;
  /* I got 76 to make it look correct but I would think it should be - 60 -20 but that left a tiny bit of space */
  height: calc(100vh - 76px);
  box-sizing: border-box;
  min-width: 30vw;
  max-width: 50vw;
}
#manage-categories.visible {
  opacity: 1;
  pointer-events: auto;
}
</style>
