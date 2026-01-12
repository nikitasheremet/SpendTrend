<script lang="ts" setup>
import CategoryView from './CategoryView.vue'
import AddCategory from './AddCategory.vue'
import Button from '@/components/DesignSystem/Button/Button.vue'
import { getStore } from '@/store/store'

const store = getStore()

const { isOpen } = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  closeManageCategories: []
}>()
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
      class="flex flex-col fixed border bg-gray-50 z-2000 p-5 top-15 right-0 h-[calc(100vh-61px)] box-border min-w-[30vw] max-w-[50vw] shadow-xl"
    >
      <div id="manage-categories-header" class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Your Expense Categories</h2>
        <Button class="font-semibold" @click="emit('closeManageCategories')">X</Button>
      </div>
      <AddCategory />
      <ul class="overflow-y-auto">
        <li class="mb-4" v-for="category in store.categories.value" :key="category.name">
          <CategoryView :category="category" />
        </li>
      </ul>
    </div>
  </Transition>
</template>

<style scoped></style>
