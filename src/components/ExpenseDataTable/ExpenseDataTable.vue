<script setup lang="ts">
import ExpenseDataRows from '@/components/ExpenseDataTable/ExpenseDataRows/ExpenseDataRows.vue'
import ExpenseDataTableHead from '../ExpenseDataTableHead.vue'
</script>

<template>
  <table>
    <ExpenseDataTableHead />
    <tbody>
      <ExpenseDataRows />
    </tbody>
  </table>
</template>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
