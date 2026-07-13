import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { useControlCategoryOptions } from '../useControlCategoryOptions'

const ControlCategoryOptionsHarness = defineComponent({
  setup() {
    const { isOptionsOpen, isOptionsClosing, toggleOptions, closeOptions, hideOptionsImmediately } =
      useControlCategoryOptions()

    return { isOptionsOpen, isOptionsClosing, toggleOptions, closeOptions, hideOptionsImmediately }
  },
  template: `<div>
    <button data-testid="toggle" @click="toggleOptions" @blur="closeOptions">⋮</button>
    <div v-if="isOptionsOpen" data-testid="options" :class="{ invisible: isOptionsClosing }">
      <button data-testid="option" @mousedown="hideOptionsImmediately">Update Category</button>
    </div>
  </div>`,
})

describe('when using the category options dropdown', () => {
  it('should open the dropdown, visible and not closing', async () => {
    render(ControlCategoryOptionsHarness)

    await userEvent.click(screen.getByTestId('toggle'))

    const options = screen.getByTestId('options')
    expect(options).not.toHaveClass('invisible')
  })

  it('should hide the dropdown immediately (before it is unmounted) when an option is selected', async () => {
    render(ControlCategoryOptionsHarness)

    await userEvent.click(screen.getByTestId('toggle'))
    screen.getByTestId('option').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()

    const options = screen.getByTestId('options')
    expect(options).toHaveClass('invisible')
  })

  it('should reset the closing state when reopened', async () => {
    render(ControlCategoryOptionsHarness)

    await userEvent.click(screen.getByTestId('toggle'))
    screen.getByTestId('option').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(screen.getByTestId('options')).toHaveClass('invisible')

    await userEvent.click(screen.getByTestId('toggle'))
    expect(screen.queryByTestId('options')).not.toBeInTheDocument()

    await userEvent.click(screen.getByTestId('toggle'))
    expect(screen.getByTestId('options')).not.toHaveClass('invisible')
  })
})
