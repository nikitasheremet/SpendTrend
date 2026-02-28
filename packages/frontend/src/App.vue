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
const appVersion = __APP_VERSION__

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
  <div class="flex min-h-screen flex-col">
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
    <div class="flex-1 p-5">
      <RouterView />
    </div>
    <footer class="px-5 py-2 text-center text-xs text-gray-500">version: {{ appVersion }}</footer>
  </div>
</template>
