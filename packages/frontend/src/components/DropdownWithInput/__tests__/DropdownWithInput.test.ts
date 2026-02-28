import { render, screen } from '@testing-library/vue'
import { fireEvent } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import DropdownWithInput from '../DropdownWithInput.vue'

function getDropdownElement(): HTMLElement {
  const dropdownElement = document.querySelector('.dropdown-input')

  if (!dropdownElement) {
    throw new Error('Dropdown element is not rendered')
  }

  return dropdownElement as HTMLElement
}

function getDropdownToggleElement(): HTMLElement {
  const dropdownToggleElement = document.querySelector('.dropdown-input > div')

  if (!dropdownToggleElement) {
    throw new Error('Dropdown toggle element is not rendered')
  }

  return dropdownToggleElement as HTMLElement
}

describe('DropdownWithInput', () => {
  describe('when input is focused', () => {
    it('should show dropdown options', async () => {
      render(DropdownWithInput, {
        props: {
          dropdownOptions: ['fakeOption1'],
        },
      })
      expect(screen.queryByText('fakeOption1')).toBeNull()
      await userEvent.click(getDropdownToggleElement())
      screen.getByText('fakeOption1')
    })
  })
  describe('when input is blurred', () => {
    it('should hide dropdown options', async () => {
      render(DropdownWithInput, {
        props: {
          dropdownOptions: ['fakeOption1'],
        },
      })
      await userEvent.click(getDropdownToggleElement())
      screen.getByText('fakeOption1')

      await fireEvent.blur(getDropdownElement())

      expect(screen.queryByText('fakeOption1')).toBeNull()
    })
  })
  describe('when autofocus is enabled', () => {
    it('should show dropdown options by default', () => {
      render(DropdownWithInput, {
        props: {
          dropdownOptions: ['qwe', 'asd', 'wer'],
          autofocus: true,
        },
      })

      screen.getByText('qwe')
      screen.getByText('wer')
    })
  })
  describe('when user selects one of the dropdown options', () => {
    it('should hide the dropdown options, fill the input field with the selected option, and blur the input', async () => {
      const { emitted } = render(DropdownWithInput, {
        props: {
          dropdownOptions: ['fakeOption1', 'fakeOption2'],
        },
      })

      await userEvent.click(getDropdownToggleElement())

      // Asserts that alternate option is visible in dropdown
      screen.getByText('fakeOption2')
      await userEvent.click(screen.getByText('fakeOption1'))

      // The dropdown options have now been hidden
      expect(screen.queryByText('fakeOption2')).toBeNull()

      expect(screen.getByText('fakeOption1')).toBeTruthy()
      expect(emitted().onChange).toEqual([['fakeOption1']])
      expect(emitted().isInputValid).toEqual([[true]])
    })
  })
  describe('when user presses enter key', () => {
    it('should not emit escapeKeyPressed', async () => {
      const { emitted } = render(DropdownWithInput, {
        props: {
          dropdownOptions: ['fakeOption1', 'fakeOption2'],
        },
      })

      await fireEvent.keyDown(getDropdownElement(), { key: 'Enter' })

      expect(emitted().escapeKeyPressed).toBeUndefined()
    })
  })
  describe('when user presses esc key', () => {
    it('should emit escapeKeyPressed', async () => {
      const { emitted } = render(DropdownWithInput, {
        props: {
          dropdownOptions: ['fakeOption1', 'fakeOption2'],
        },
      })

      await fireEvent.keyDown(getDropdownElement(), { key: 'Escape' })

      expect(emitted().escapeKeyPressed).toEqual([[]])
    })
  })
  describe('when dropdown opens near viewport boundaries', () => {
    it('should use minimum width fallback and top guard positioning', async () => {
      Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        value: 220,
      })

      render(DropdownWithInput, {
        props: {
          dropdownOptions: ['fakeOption1'],
        },
      })

      const dropdownToggleElement = getDropdownToggleElement()

      Object.defineProperty(dropdownToggleElement, 'offsetWidth', {
        configurable: true,
        value: 120,
      })

      vi.spyOn(dropdownToggleElement, 'getBoundingClientRect').mockReturnValue({
        x: 20,
        y: 100,
        width: 120,
        height: 30,
        top: 100,
        right: 140,
        bottom: 130,
        left: 20,
        toJSON: () => ({}),
      } as DOMRect)

      const mockOffsetHeightGetter = vi
        .spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
        .mockImplementation(function mockOffsetHeight(this: HTMLElement) {
          if (this.classList.contains('dropdown-options')) {
            return 220
          }

          return 0
        })

      await userEvent.click(dropdownToggleElement)

      const dropdownOptionsElement = document.querySelector('.dropdown-options') as HTMLElement
      expect(dropdownOptionsElement).toBeTruthy()

      expect(dropdownOptionsElement.style.width).toBe('160px')
      expect(dropdownOptionsElement.style.top).toBe('8px')
      expect(dropdownOptionsElement.style.left).toBe('20px')

      mockOffsetHeightGetter.mockRestore()
    })
  })
})
