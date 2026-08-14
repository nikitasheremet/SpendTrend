import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'
import { useControlCategoryOptions } from '../useControlCategoryOptions'

const ControlCategoryOptionsHarness = defineComponent({
  setup() {
    const { isOptionsOpen, toggleOptions, closeOptions } = useControlCategoryOptions()

    return { isOptionsOpen, toggleOptions, closeOptions }
  },
  template: `<div>
    <button data-testid="toggle" @click="toggleOptions">⋮</button>
    <div v-if="isOptionsOpen" data-testid="options">
      <button data-testid="option" @click="closeOptions">Update Category</button>
    </div>
  </div>`,
})

describe('when using the category options dropdown', () => {
  it('should open the dropdown on toggle', async () => {
    render(ControlCategoryOptionsHarness)

    await userEvent.click(screen.getByTestId('toggle'))

    expect(screen.getByTestId('options')).toBeInTheDocument()
  })

  it('should close the dropdown on a second toggle', async () => {
    render(ControlCategoryOptionsHarness)

    await userEvent.click(screen.getByTestId('toggle'))
    await userEvent.click(screen.getByTestId('toggle'))

    expect(screen.queryByTestId('options')).not.toBeInTheDocument()
  })

  it('should close the dropdown immediately when an option is selected', async () => {
    render(ControlCategoryOptionsHarness)

    await userEvent.click(screen.getByTestId('toggle'))
    await userEvent.click(screen.getByTestId('option'))

    expect(screen.queryByTestId('options')).not.toBeInTheDocument()
  })
})
