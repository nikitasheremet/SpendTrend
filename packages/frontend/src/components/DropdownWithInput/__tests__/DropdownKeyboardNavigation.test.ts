import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { vi, type MockInstance } from 'vitest'
import DropdownWithInput from '../DropdownWithInput.vue'

const OPTIONS = ['Apple', 'Banana', 'Cherry']

let scrollIntoView: MockInstance<Element['scrollIntoView']>

beforeEach(() => {
  scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
})

afterEach(() => {
  scrollIntoView.mockRestore()
})

// Opens by click rather than `autofocus`: testing-library's render re-parents
// the mounted tree afterwards, which drops focus set during mount.
async function renderOpenDropdown(props: Record<string, unknown> = {}) {
  const result = render(DropdownWithInput, {
    props: {
      dropdownOptions: OPTIONS,
      ...props,
    },
  })
  await userEvent.click(getDropdownToggleElement())
  return result
}

function getDropdownToggleElement(): HTMLElement {
  const dropdownToggleElement = document.querySelector('.dropdown-input > div')

  if (!dropdownToggleElement) {
    throw new Error('Dropdown toggle element is not rendered')
  }

  return dropdownToggleElement as HTMLElement
}

function getHighlightedOption() {
  return screen.queryByRole('option', { selected: true })
}

describe('DropdownWithInput keyboard navigation', () => {
  describe('when the dropdown opens', () => {
    it('renders the options as a listbox of options', async () => {
      await renderOpenDropdown()

      screen.getByRole('listbox')
      expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(OPTIONS)
    })

    it('highlights the current value and scrolls it into view', async () => {
      await renderOpenDropdown({ modelValue: 'Banana' })

      expect(getHighlightedOption()).toHaveTextContent('Banana')
      await waitFor(() => {
        expect(scrollIntoView).toHaveBeenCalled()
      })
      expect(scrollIntoView.mock.contexts.at(-1)).toHaveTextContent('Banana')
    })

    it('highlights the Uncategorized option when the value is empty', async () => {
      await renderOpenDropdown({ modelValue: '', includeEmptyOption: true })

      expect(getHighlightedOption()).toHaveTextContent('Uncategorized')
    })

    it('highlights nothing when there is no value and no empty option', async () => {
      await renderOpenDropdown()

      expect(getHighlightedOption()).toBeNull()
    })
  })

  describe('arrow keys', () => {
    it('moves the highlight down and up, scrolling it into view', async () => {
      const user = userEvent.setup()
      await renderOpenDropdown()

      await user.keyboard('{ArrowDown}')
      expect(getHighlightedOption()).toHaveTextContent('Apple')
      await user.keyboard('{ArrowDown}')
      expect(getHighlightedOption()).toHaveTextContent('Banana')
      await user.keyboard('{ArrowUp}')
      expect(getHighlightedOption()).toHaveTextContent('Apple')
      expect(scrollIntoView.mock.contexts.at(-1)).toHaveTextContent('Apple')
    })

    it('stops at the last option without wrapping', async () => {
      const user = userEvent.setup()
      await renderOpenDropdown({ modelValue: 'Cherry' })

      await user.keyboard('{ArrowDown}')

      expect(getHighlightedOption()).toHaveTextContent('Cherry')
    })

    it('stops at the first option without wrapping', async () => {
      const user = userEvent.setup()
      await renderOpenDropdown({ modelValue: 'Apple' })

      await user.keyboard('{ArrowUp}')

      expect(getHighlightedOption()).toHaveTextContent('Apple')
    })
  })

  describe('mouse hover', () => {
    it('moves the highlight to the hovered option', async () => {
      const user = userEvent.setup()
      await renderOpenDropdown({ modelValue: 'Apple' })

      await user.hover(screen.getByRole('option', { name: 'Cherry' }))

      expect(getHighlightedOption()).toHaveTextContent('Cherry')
    })
  })

  describe('Enter', () => {
    it('selects the highlighted option and closes the dropdown', async () => {
      const user = userEvent.setup()
      const { emitted } = await renderOpenDropdown({ modelValue: 'Apple' })

      await user.keyboard('{ArrowDown}{Enter}')

      await waitFor(() => {
        expect(emitted().onChange).toEqual([['Banana']])
      })
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    it('fires onChange when the highlighted option is already the current value', async () => {
      const user = userEvent.setup()
      const { emitted } = await renderOpenDropdown({ modelValue: 'Apple' })

      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(emitted().onChange).toEqual([['Apple']])
      })
    })

    it('selects the empty value when Uncategorized is highlighted', async () => {
      const user = userEvent.setup()
      const { emitted } = await renderOpenDropdown({ modelValue: '', includeEmptyOption: true })

      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(emitted().onChange).toEqual([['']])
      })
    })

    it('does nothing and keeps the dropdown open when nothing is highlighted', async () => {
      const user = userEvent.setup()
      const { emitted } = await renderOpenDropdown()

      await user.keyboard('{Enter}')

      expect(emitted().onChange).toBeUndefined()
      screen.getByRole('listbox')
    })
  })

  describe('Escape', () => {
    it('closes a non-searchable dropdown and asks for the original value back', async () => {
      const user = userEvent.setup()
      const { emitted } = await renderOpenDropdown({ modelValue: 'Apple' })

      await user.keyboard('{ArrowDown}{Escape}')

      expect(screen.queryByRole('listbox')).toBeNull()
      expect(emitted().escapeKeyPressed).toEqual([[]])
      expect(emitted().onChange).toBeUndefined()
    })

    it('closes a searchable dropdown and asks for the original value back', async () => {
      const user = userEvent.setup()
      const { emitted } = await renderOpenDropdown({ modelValue: 'Apple', searchable: true })

      expect(screen.getByPlaceholderText('Search...')).toHaveFocus()
      await user.keyboard('{ArrowDown}{Escape}')

      expect(screen.queryByRole('listbox')).toBeNull()
      expect(emitted().escapeKeyPressed).toEqual([[]])
      expect(emitted().onChange).toBeUndefined()
    })
  })

  describe('Tab', () => {
    it('closes the dropdown without selecting anything', async () => {
      const user = userEvent.setup()
      const { emitted } = await renderOpenDropdown({ modelValue: 'Apple', searchable: true })

      await user.keyboard('{ArrowDown}{Tab}')

      expect(screen.queryByRole('listbox')).toBeNull()
      expect(emitted().onChange).toBeUndefined()
    })
  })

  describe('search', () => {
    it('highlights the first matching option as the search text changes', async () => {
      const user = userEvent.setup()
      await renderOpenDropdown({ modelValue: 'Cherry', searchable: true })

      await user.type(screen.getByPlaceholderText('Search...'), 'an')

      expect(getHighlightedOption()).toHaveTextContent('Banana')
    })

    it('highlights nothing when no option matches', async () => {
      const user = userEvent.setup()
      await renderOpenDropdown({ modelValue: 'Cherry', searchable: true })

      await user.type(screen.getByPlaceholderText('Search...'), 'zzz')

      expect(getHighlightedOption()).toBeNull()
    })

    it('selects the first match with Enter', async () => {
      const user = userEvent.setup()
      const { emitted } = await renderOpenDropdown({ searchable: true })

      await user.type(screen.getByPlaceholderText('Search...'), 'err{Enter}')

      await waitFor(() => {
        expect(emitted().onChange).toEqual([['Cherry']])
      })
    })
  })

  describe('Create option', () => {
    it('is never highlighted automatically', async () => {
      const user = userEvent.setup()
      const onCreateOption = vi.fn().mockResolvedValue('Durian')
      const { emitted } = await renderOpenDropdown({ searchable: true, onCreateOption })

      await user.type(screen.getByPlaceholderText('Search...'), 'Durian{Enter}')

      expect(onCreateOption).not.toHaveBeenCalled()
      expect(emitted().onChange).toBeUndefined()
    })

    it('is the last stop for ArrowDown and creates the option with Enter', async () => {
      const user = userEvent.setup()
      const onCreateOption = vi.fn().mockResolvedValue('Banana split')
      const { emitted } = await renderOpenDropdown({ searchable: true, onCreateOption })

      await user.type(screen.getByPlaceholderText('Search...'), 'Banana s')
      expect(getHighlightedOption()).toBeNull()

      await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')

      expect(onCreateOption).toHaveBeenCalledWith('Banana s')
      await waitFor(() => {
        expect(emitted().onChange).toEqual([['Banana split']])
      })
    })

    it('can be reached after the matching options', async () => {
      const user = userEvent.setup()
      const onCreateOption = vi.fn().mockResolvedValue('an')
      await renderOpenDropdown({ searchable: true, onCreateOption })

      await user.type(screen.getByPlaceholderText('Search...'), 'an')
      expect(getHighlightedOption()).toHaveTextContent('Banana')

      await user.keyboard('{ArrowDown}')
      expect(getHighlightedOption()).toBeNull()
      await user.keyboard('{ArrowDown}{Enter}')

      expect(onCreateOption).toHaveBeenCalledWith('an')
    })
  })
})
