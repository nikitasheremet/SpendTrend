<script lang="ts" setup>
import CategoryView from './CategoryView.vue'
import AddCategory from './AddCategory.vue'
import { useGetCategories } from './hooks/useGetCategories'
import Error from '../DesignSystem/Error.vue'

const { categories, error, newCategoriesAdded, categoryDeleted } = useGetCategories()
</script>

<template>
  <div>
    <AddCategory @category-added="newCategoriesAdded" />
    <ul>
      <li v-for="category in categories" :key="category.name">
        <CategoryView :category="category" @category-deleted="categoryDeleted" />
      </li>
    </ul>
  </div>
  <Error v-if="error" :error="error" />
</template>

<style scoped></style>
