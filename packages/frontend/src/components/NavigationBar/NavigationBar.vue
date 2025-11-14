<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { DASHBOARD_PATH } from '@/router/paths'
import Button from '@/components/DesignSystem/Button/Button.vue'

const isLoggedIn = defineProps<{
  isLoggedIn: boolean
}>()
const emit = defineEmits<{
  logout: []
  manageCategoriesClicked: []
}>()

const router = useRouter()
const currentRoute = ref(router.currentRoute.value.path)
router.afterEach((to) => {
  currentRoute.value = to.path
})

const navigationLinks = [
  { name: 'Dashboard', path: DASHBOARD_PATH },
  { name: 'Add Expenses/Income', path: '/adddata' },
  { name: 'Expenses', path: '/expensedata' },
  { name: 'Income', path: '/incomedata' },
]
</script>

<template>
  <div class="flex h-15 justify-between items-center">
    <div class="flex gap-7.5">
      <RouterLink
        class="group hover:text-black/50"
        v-for="link in navigationLinks"
        :key="link.name"
        :to="link.path"
      >
        <span>{{ link.name }}</span>
        <div
          v-if="link.path === currentRoute"
          class="bg-black group-hover:bg-black/50 w-full h-0.5 mt-1"
        ></div>
      </RouterLink>
    </div>
    <div class="flex gap-7.5">
      <Button
        classToAdd="bg-gray-200 px-3.5 py-1.5 rounded-md hover:bg-gray-200/50"
        @click="emit('manageCategoriesClicked')"
      >
        Manage Categories
      </Button>
      <Button classToAdd="hover:text-black/50" v-if="isLoggedIn" @click="emit('logout')">
        Logout
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
