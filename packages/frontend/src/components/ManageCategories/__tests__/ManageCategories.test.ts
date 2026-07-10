import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import type { Store } from '@/store/storeInterface'
import ManageCategories from '../ManageCategories.vue'

vi.mock('@/store/store', () => ({
  getStore: () =>
    ({
      categories: ref([]),
    }) as unknown as Store,
}))

vi.mock('../CategoryView.vue', () => ({
  default: {
    name: 'MockCategoryView',
    props: ['category'],
    template: '<div data-testid="mock-category-view" />',
  },
}))

vi.mock('../AddCategory.vue', () => ({
  default: {
    name: 'MockAddCategory',
    template: '<div data-testid="mock-add-category" />',
  },
}))

describe('when the manage categories panel is open', () => {
  it('should emit closeManageCategories when clicking outside the panel', async () => {
    const { emitted } = render(ManageCategories, { props: { isOpen: true } })

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(emitted().closeManageCategories).toHaveLength(1)
  })

  it('should not emit closeManageCategories when clicking inside the panel', async () => {
    const { emitted } = render(ManageCategories, { props: { isOpen: true } })

    await userEvent.click(screen.getByText('Your Expense Categories'))

    expect(emitted().closeManageCategories).toBeUndefined()
  })

  it('should emit closeManageCategories when clicking the close button', async () => {
    const { emitted } = render(ManageCategories, { props: { isOpen: true } })

    await userEvent.click(screen.getByText('X'))

    expect(emitted().closeManageCategories).toHaveLength(1)
  })

  it('should emit closeManageCategories when pressing Escape', async () => {
    const { emitted } = render(ManageCategories, { props: { isOpen: true } })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(emitted().closeManageCategories).toHaveLength(1)
  })
})

describe('when clicking the external toggle button that opened the panel', () => {
  it('should stay closed instead of flickering back open', async () => {
    const ToggleHarness = defineComponent({
      components: { ManageCategories },
      setup() {
        const isOpen = ref(true)
        function toggle() {
          isOpen.value = !isOpen.value
        }
        return { isOpen, toggle }
      },
      template: `<div>
        <button data-testid="toggle-button" @click="toggle">Manage Categories</button>
        <ManageCategories :is-open="isOpen" @close-manage-categories="isOpen = false" />
      </div>`,
    })

    render(ToggleHarness)

    await userEvent.click(screen.getByTestId('toggle-button'))

    expect(screen.getByText('Your Expense Categories').closest('#manage-categories')).not.toBeVisible()
  })
})

describe('when clicking inside a teleported child of the panel', () => {
  it('should not close the panel', async () => {
    const { emitted } = render(ManageCategories, { props: { isOpen: true } })

    const portalElement = document.createElement('button')
    portalElement.setAttribute('data-manage-categories-portal', '')
    document.body.appendChild(portalElement)

    portalElement.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(emitted().closeManageCategories).toBeUndefined()

    document.body.removeChild(portalElement)
  })
})

describe('when the manage categories panel is closed', () => {
  it('should not emit closeManageCategories when clicking outside', async () => {
    const { emitted } = render(ManageCategories, { props: { isOpen: false } })

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(emitted().closeManageCategories).toBeUndefined()
  })

  it('should not emit closeManageCategories when pressing Escape', async () => {
    const { emitted } = render(ManageCategories, { props: { isOpen: false } })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(emitted().closeManageCategories).toBeUndefined()
  })
})
