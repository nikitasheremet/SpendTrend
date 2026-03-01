import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import DropdownOptions from '../DropdownOptions.vue'

describe('DropdownOptions', () => {
  const fakeProps = {
    options: ['optionA', 'optionB'],
    optionsStyle: {
      top: '10px',
      left: '20px',
      width: '160px',
    },
  }
  describe('when an array of strings is passed in', () => {
    it('should render the list of strings', () => {
      render(DropdownOptions, {
        props: fakeProps,
      })
      screen.getByText('optionA')
      screen.getByText('optionB')
    })
  })
  describe('when an option is clicked', () => {
    it('should emit a clicked event with the string value of the option', async () => {
      const { emitted } = render(DropdownOptions, {
        props: fakeProps,
      })
      await userEvent.click(screen.getByText('optionA'))
      const emittedEventName = 'dropdownOptionClick'
      const emittedEvents = emitted()
      expect(emittedEvents[emittedEventName]).toEqual([['optionA']])
    })
  })
  describe('when dropdown options are rendered', () => {
    it('should apply fixed positioning style, max height, scroll and wrapping classes', () => {
      render(DropdownOptions, {
        props: fakeProps,
      })

      const dropdownOptionsContainer = document.querySelector('.dropdown-options') as HTMLElement
      expect(dropdownOptionsContainer).toBeTruthy()
      expect(dropdownOptionsContainer.style.top).toBe('10px')
      expect(dropdownOptionsContainer.style.left).toBe('20px')
      expect(dropdownOptionsContainer.style.width).toBe('160px')
      expect(dropdownOptionsContainer.className).toContain('max-h-[200px]')
      expect(dropdownOptionsContainer.className).toContain('overflow-y-auto')

      const dropdownOption = screen.getByText('optionA').parentElement as HTMLElement
      expect(dropdownOption.className).toContain('whitespace-normal')
      expect(dropdownOption.className).toContain('wrap-break-word')
    })
  })
})
