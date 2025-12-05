<script lang="ts" setup>
import CategoryView from './CategoryView.vue'
import AddCategory from './AddCategory.vue'
import { useGetCategories } from './hooks/useGetCategories'
import Error from '../DesignSystem/Error.vue'
import Button from '@/components/DesignSystem/Button/Button.vue'

const { isOpen } = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  closeManageCategories: []
}>()

const { categories, error, newCategoriesAdded, categoryDeleted } = useGetCategories()
</script>

<template>
  <Transition
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
    enter-active-class="transition-transform duration-300 ease-in-out"
    leave-active-class="transition-transform duration-300 ease-in-out"
  >
    <div
      id="manage-categories"
      v-show="isOpen"
      class="flex flex-col fixed border bg-gray-50 z-2000 p-5 top-21 right-0 h-[calc(100vh-85px)] box-border min-w-[30vw] max-w-[50vw] shadow-xl"
    >
      <div id="manage-categories-header" class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Your Expense Categories</h2>
        <Button class="font-semibold" @click="emit('closeManageCategories')">X</Button>
      </div>
      <AddCategory @category-added="newCategoriesAdded" />
      <ul class="overflow-y-auto">
        <li class="mb-4" v-for="category in categories" :key="category.name">
          <CategoryView :category="category" @category-deleted="categoryDeleted" />
        </li>
      </ul>
    </div>
  </Transition>
  <Error v-if="error" :error="error" />
</template>

<style scoped></style>
