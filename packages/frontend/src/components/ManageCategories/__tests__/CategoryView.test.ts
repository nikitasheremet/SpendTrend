import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import type { ExpenseCategory } from '@/types/expenseData'
import CategoryView from '../CategoryView.vue'

vi.mock('@/store/store', () => ({
  getStore: () => ({ addCategory: vi.fn(), updateCategory: vi.fn(), deleteCategory: vi.fn() }),
}))
vi.mock('@/service/categories/updateCategory', () => ({
  updateCategory: vi.fn(() => new Promise(() => {})),
}))
vi.mock('@/service/categories/deleteCategory', () => ({
  deleteCategory: vi.fn(() => new Promise(() => {})),
}))
vi.mock('@/service/categories/addNewCategories', () => ({
  addNewCategory: vi.fn(() => new Promise(() => {})),
}))

const category: ExpenseCategory = {
  id: 'c1',
  userId: 'u1',
  accountId: 'a1',
  name: 'Food',
  subCategories: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('when using the category options dropdown', () => {
  it('should open the dropdown when clicking the options button', async () => {
    render(CategoryView, { props: { category } })

    await userEvent.click(screen.getByText('⋮'))

    expect(screen.getByText('Update Category')).toBeInTheDocument()
  })

  it('should close the dropdown when clicking away from it', async () => {
    render(CategoryView, { props: { category } })

    await userEvent.click(screen.getByText('⋮'))
    expect(screen.getByText('Update Category')).toBeInTheDocument()

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    expect(screen.queryByText('Update Category')).not.toBeInTheDocument()
  })

  it('should close the dropdown when selecting an option', async () => {
    render(CategoryView, { props: { category } })

    await userEvent.click(screen.getByText('⋮'))
    await userEvent.click(screen.getByText('Update Category'))

    expect(screen.queryByText('Update Category')).not.toBeInTheDocument()
  })

  it('should close the dropdown when toggling the options button again', async () => {
    render(CategoryView, { props: { category } })

    await userEvent.click(screen.getByText('⋮'))
    expect(screen.getByText('Update Category')).toBeInTheDocument()

    await userEvent.click(screen.getByText('⋮'))

    expect(screen.queryByText('Update Category')).not.toBeInTheDocument()
  })
})
