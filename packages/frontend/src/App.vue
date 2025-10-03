<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { authClient } from './lib/auth-client'
import { onMounted } from 'vue'
import router from './router'

onMounted(async () => {
  const { data: session } = await authClient.getSession()
  if (!session?.session || new Date() > new Date(session.session.expiresAt)) {
    router.push('/login')
  }
})
</script>

<template>
  <div id="app-body">
    <div id="top-nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/expensedata">Expense Data</RouterLink>
      <RouterLink to="/adddata">Add Data</RouterLink>
      <RouterLink to="/managecategories">Manage Categories</RouterLink>
      <RouterLink to="/incomedata">Income Data</RouterLink>
    </div>

    <div id="page-wrapper"><RouterView /></div>
  </div>
</template>

<style scoped>
#app-body {
  width: 100%;
  height: 100%;
}

#top-nav {
  background-color: rgb(107, 6, 150);
  padding: 15px;
  color: white;
  display: flex;
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
  margin-top: 20px;
}
</style>
