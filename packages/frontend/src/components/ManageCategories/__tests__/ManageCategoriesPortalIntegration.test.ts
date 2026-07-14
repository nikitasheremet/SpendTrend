import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import type { Store } from '@/store/storeInterface'
import ManageCategories from '../ManageCategories.vue'

vi.mock('@/store/store', () => ({
  getStore: () =>
    ({
      categories: ref([{ name: 'Food', subCategories: [{ id: 'sc1', name: 'Snacks' }] }]),
      updateSubCategory: vi.fn(),
    }) as unknown as Store,
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
vi.mock('@/service/categories/deleteSubCategory', () => ({
  deleteSubCategory: vi.fn(() => new Promise(() => {})),
}))
vi.mock('@/service/categories/updateSubCategory', () => ({
  updateSubCategory: vi.fn(() => new Promise(() => {})),
}))

/**
 * This exercises the real CategoryView/SubcategoryView tree (unlike ManageCategories.test.ts,
 * which stubs CategoryView) because the teleported subcategory options dropdown is a separate
 * <Teleport to="body"> in SubcategoryView.vue that needs its own data-manage-categories-portal
 * marker for useClickOutside to ignore clicks on it. Regression test for a bug where clicking a
 * subcategory's "⋮" options and then an option closed the whole panel.
 */
describe('when interacting with the teleported subcategory options dropdown', () => {
  it('should not close the panel when opening the subcategory options dropdown or clicking an option in it', async () => {
    const { emitted } = render(ManageCategories, { props: { isOpen: true } })

    await userEvent.click(screen.getByText('Food'))

    const optionsButtons = screen.getAllByText('⋮')
    const subCategoryOptionsButton = optionsButtons[optionsButtons.length - 1]
    await userEvent.click(subCategoryOptionsButton)

    expect(emitted().closeManageCategories).toBeUndefined()

    await userEvent.click(screen.getByText('Update SubCategory'))

    expect(emitted().closeManageCategories).toBeUndefined()
  })
})
