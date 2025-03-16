<script lang="ts" setup>
import { store } from '@/store/store'
import CategoryView from './CategoryView.vue'
import AddCategory from '../AddCategory/AddCategory.vue'
import { ref } from 'vue'

const categories = ref<string[]>(store.getCategories())

function handleCategoriesUpdated() {
  categories.value = store.getCategories()
}
</script>

<template>
  <div>
    <AddCategory @categories-updated="handleCategoriesUpdated" />
    <ul>
      <li v-for="category in categories" :key="category">
        <CategoryView
          :category-name="category"
          :subcategories="store.getSubcategoriesForCategory(category)"
          @categories-updated="handleCategoriesUpdated"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
