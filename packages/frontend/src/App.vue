<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { authClient } from './lib/auth-client'
import { onMounted, ref } from 'vue'
import router from './router'
import ManageCategories from './components/ManageCategories/ManageCategories.vue'

const isLoggedIn = ref(false)
const isManageCategoriesOpen = ref(false)
onMounted(async () => {
  const { data: session } = await authClient.getSession()
  if (!session?.session || new Date() > new Date(session.session.expiresAt)) {
    router.push('/login')
  } else {
    isLoggedIn.value = true
  }
})
async function logout() {
  if (window.confirm('Are you sure you want to logout?')) {
    await authClient.signOut()
    router.push('/login')
  }
}
</script>

<template>
  <div id="top-nav">
    <div>
      <RouterLink to="/">Dashboard</RouterLink>
      <RouterLink to="/adddata">Add Expenses/Income</RouterLink>
      <RouterLink to="/expensedata">Expenses</RouterLink>
      <RouterLink to="/incomedata">Income</RouterLink>
    </div>
    <div>
      <button @click="isManageCategoriesOpen = !isManageCategoriesOpen">Manage Categories</button>
      <button style="align-self: flex-end" v-if="isLoggedIn" @click="logout">Logout</button>
    </div>
  </div>

  <div id="page-wrapper">
    <div style="position: relative">
      <ManageCategories
        :is-open="isManageCategoriesOpen"
        @close-manage-categories="isManageCategoriesOpen = false"
      />
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
#top-nav {
  flex-shrink: 0;
  height: 60px;
  box-sizing: border-box;
  background-color: rgb(107, 6, 150);
  padding: 15px;
  color: white;
  display: flex;
  justify-content: space-between;
  a {
    color: rgb(221, 221, 221);
    margin-right: 10px;
    text-decoration: none;
  }
  a:hover {
    color: white;
  }
}

#page-wrapper {
  padding: 20px;
  height: 100%;
}
</style>
