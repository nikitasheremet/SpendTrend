import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import DropdownOptions from '../DropdownOptions.vue'

describe('DropdownOptions', () => {
  const fakeProps = {
    options: ['optionA', 'optionB'],
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
})
