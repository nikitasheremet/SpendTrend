import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddDataView from '../views/AddDataView.vue'
import ExpenseDataView from '../views/ExpenseDataView.vue'
import ManageCategoriesView from '../views/ManageCategoriesView.vue'
import IncomeDataView from '@/views/IncomeDataView.vue'
import LoginView from '@/views/LoginView.vue'

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
      path: '/addData',
      component: AddDataView,
    },
    {
      path: '/manageCategories',
      component: ManageCategoriesView,
    },
    {
      path: '/incomedata',
      component: IncomeDataView,
    },
    {
      path: '/login',
      component: LoginView,
    },
  ],
})

export default router
