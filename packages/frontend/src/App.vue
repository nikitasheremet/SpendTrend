<script setup lang="ts">
import { RouterView } from 'vue-router'
import { authClient } from './lib/auth-client'
import { onMounted, ref, useTemplateRef } from 'vue'
import router from './router'
import ManageCategories from './components/ManageCategories/ManageCategories.vue'
import NavigationBar from './components/NavigationBar/NavigationBar.vue'
import { isUserSessionActive } from './helpers/auth/isUserSessionActive'
import { LOGIN_PATH } from './router/paths'
import Popover from './components/DesignSystem/Popover/Popover.vue'
import { useProvidePopover } from './components/DesignSystem/Popover/useProvidePopover'

const isLoggedIn = ref(false)
const isManageCategoriesOpen = ref(false)
const popoverRef = useTemplateRef('popover-ref')

useProvidePopover(popoverRef)

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
  <div class="flex-none h-15">
    <NavigationBar
      v-if="isLoggedIn"
      :is-logged-in="isLoggedIn"
      @logout="logout"
      @manage-categories-clicked="toggleManageCategories"
    />
  </div>
  <ManageCategories
    :is-open="isManageCategoriesOpen"
    @close-manage-categories="isManageCategoriesOpen = false"
  />
  <Popover ref="popover-ref" />
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
