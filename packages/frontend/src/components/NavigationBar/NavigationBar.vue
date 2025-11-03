<script setup lang="ts">
const isLoggedIn = defineProps<{
  isLoggedIn: boolean
}>()
const emit = defineEmits<{
  logout: []
  manageCategoriesClicked: []
}>()
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
      <button @click="emit('manageCategoriesClicked')">Manage Categories</button>
      <button style="align-self: flex-end" v-if="isLoggedIn" @click="emit('logout')">Logout</button>
    </div>
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
</style>
