<script setup lang="ts">
import { RouterView } from 'vue-router'
import { authClient } from './lib/auth-client'
import { onMounted, ref } from 'vue'
import router from './router'
import ManageCategories from './components/ManageCategories/ManageCategories.vue'
import NavigationBar from './components/NavigationBar/NavigationBar.vue'
import { isUserSessionActive } from './helpers/auth/isUserSessionActive'
import { LOGIN_PATH } from './router/paths'

const isLoggedIn = ref(false)
const isManageCategoriesOpen = ref(false)

onMounted(async () => {
  isLoggedIn.value = await isUserSessionActive()
  if (!isLoggedIn.value) {
    router.push(LOGIN_PATH)
  }
})

async function logout() {
  if (window.confirm('Are you sure you want to logout?')) {
    await authClient.signOut()
    isLoggedIn.value = false
    router.push(LOGIN_PATH)
  }
}

function toggleManageCategories() {
  isManageCategoriesOpen.value = !isManageCategoriesOpen.value
}
</script>

<template>
  <NavigationBar
    v-if="isLoggedIn"
    :is-logged-in="isLoggedIn"
    @logout="logout"
    @manage-categories-clicked="toggleManageCategories"
  />
  <ManageCategories
    :is-open="isManageCategoriesOpen"
    @close-manage-categories="isManageCategoriesOpen = false"
  />
  <div id="page-wrapper">
    <RouterView />
  </div>
</template>

<style scoped>
#page-wrapper {
  padding: 20px;
  height: 100%;
}
</style>
