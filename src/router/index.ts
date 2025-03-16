import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddExpenseView from '../views/AddExpenseView.vue'
import ExpenseDataView from '../views/ExpenseDataView.vue'
import ManageCategoriesView from '../views/ManageCategoriesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/expensedata',
      component: ExpenseDataView,
    },
    {
      path: '/addExpense',
      component: AddExpenseView,
    },
    {
      path: '/manageCategories',
      component: ManageCategoriesView,
    },
  ],
})

export default router
