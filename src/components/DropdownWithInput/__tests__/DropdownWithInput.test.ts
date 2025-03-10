import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import DropdownWithInput from '../DropdownWithInput.vue'

describe('DropdownWithInput', () => {
  describe('when input is focused', () => {
    it('should show dropdown options', async () => {
      render(DropdownWithInput, {
        props: {
          dropdownOptions: ['fakeOption1'],
        },
      })
      expect(screen.queryByText('fakeOption1')).toBeNull()
      await userEvent.click(screen.getByRole('textbox'))
      screen.getByText('fakeOption1')
    })
  })
  describe('when input is blured', () => {
    it('should hide dropdown options', async () => {
      render(DropdownWithInput, {
        props: {
          dropdownOptions: ['fakeOption1'],
        },
      })
      let input: HTMLInputElement = screen.getByRole('textbox')
      await userEvent.click(input)
      screen.getByText('fakeOption1')
      input = screen.getByRole('textbox')
      await userEvent.type(input, '{Enter}')
      expect(screen.queryByText('fakeOption1')).toBeNull()
    })
  })
  describe('when user starts typing', () => {
    it('should start filtering down the dropdown options based on the user input', async () => {
      render(DropdownWithInput, {
        props: {
          dropdownOptions: ['qwe', 'asd', 'wer'],
        },
      })
      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'we')
      screen.getByText('qwe')
      screen.getByText('wer')
    })
  })
  describe('when user selects one of the dropdown options', () => {
    it('should hide the dropdown options, fill the input field with the selected option, and blur the input', async () => {
      render(DropdownWithInput, {
        props: {
          dropdownOptions: ['fakeOption1', 'fakeOption2'],
        },
      })
      let input: HTMLInputElement = screen.getByRole('textbox')
      await userEvent.click(input)
      // Asserts that alternate option is visible in dropdown
      screen.getByText('fakeOption2')
      await userEvent.click(screen.getByText('fakeOption1'))
      // The dropdown options have now been hidden
      expect(screen.queryByText('fakeOption2')).toBeNull()
      input = screen.getByRole('textbox')
      expect(input.value).toBe('fakeOption1')
      // The input should be blurred
      expect(document.activeElement).not.toBe(input)
    })
  })
  describe('when user presses enter key', () => {
    it('should blur the input field', async () => {
      render(DropdownWithInput, {
        props: {
          dropdownOptions: ['fakeOption1', 'fakeOption2'],
        },
      })
      let input: HTMLInputElement = screen.getByRole('textbox')
      await userEvent.click(input)
      await userEvent.type(input, 'we')
      await userEvent.type(input, '{Enter}')
      input = screen.getByRole('textbox')
      expect(document.activeElement).not.toBe(input)
    })
  })
  describe('when user presses esc key', () => {
    it('should blur the input field', async () => {
      render(DropdownWithInput, {
        props: {
          dropdownOptions: ['fakeOption1', 'fakeOption2'],
        },
      })
      let input: HTMLInputElement = screen.getByRole('textbox')
      await userEvent.click(input)
      await userEvent.type(input, 'we')
      await userEvent.type(input, '{Escape}')
      input = screen.getByRole('textbox')
      expect(document.activeElement).not.toBe(input)
    })
  })
})
