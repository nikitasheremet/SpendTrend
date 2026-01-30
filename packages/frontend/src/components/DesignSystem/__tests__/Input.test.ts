import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { nextTick, ref } from 'vue'
import Input from '../Input.vue'

async function renderInput(props: any = {}, options: any = {}) {
  const result = render(Input, { props, ...options })
  await nextTick()
  return result
}

describe('Input', () => {
  it('should display initial model value', async () => {
    await renderInput({
      modelValue: 'initial value',
    })
    const input: HTMLInputElement = screen.getByRole('textbox')
    expect(input.value).toBe('initial value')
  })
  it('should update model value when user types', async () => {
    const modelValue = ref('')
    await renderInput({
      modelValue: modelValue.value,
      'onUpdate:modelValue': (value: any) => {
        modelValue.value = value
      },
    })
    const input: HTMLInputElement = screen.getByRole('textbox')
    await userEvent.type(input, 'test input')

    expect(modelValue.value).toBe('test input')
    expect(input.value).toBe('test input')
  })
  it('should update display when model value changes externally', async () => {
    const modelValue = ref('initial')
    const { rerender } = await renderInput({
      modelValue: modelValue.value,
    })
    let input: HTMLInputElement = screen.getByRole('textbox')
    expect(input.value).toBe('initial')

    await rerender({ modelValue: 'updated' })
    input = screen.getByRole('textbox')
    expect(input.value).toBe('updated')
  })
  describe('when type is string', () => {
    it('should render input with string type', async () => {
      await renderInput({
        type: 'string',
      })
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'string')
    })
  })

  describe('when type is number', () => {
    it('should render input with text type', async () => {
      await renderInput({
        type: 'number',
      })
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('should format number with two decimal places on mount', async () => {
      await renderInput({
        type: 'number',
        modelValue: 123.4,
      })
      const input: HTMLInputElement = screen.getByRole('textbox')
      expect(input.value).toBe('123.40')
    })

    it('should allow valid number input', async () => {
      const modelValue = ref<number | string>(0)
      await renderInput({
        type: 'number',
        modelValue: modelValue.value,
        'onUpdate:modelValue': (value: any) => {
          modelValue.value = value
        },
      })

      const input = screen.getByRole('textbox')

      await userEvent.clear(input)
      await userEvent.type(input, '123.45')
      expect(modelValue.value).toBe(123.45)
    })

    it('should allow integer input', async () => {
      const modelValue = ref<number | string>(0)
      await renderInput({
        type: 'number',
        modelValue: modelValue.value,
        'onUpdate:modelValue': (value: any) => {
          modelValue.value = value
        },
      })
      const input = screen.getByRole('textbox')
      await userEvent.clear(input)
      await userEvent.type(input, '123')
      expect(modelValue.value).toBe(123)
    })

    it('should allow decimal input without leading zero', async () => {
      const modelValue = ref<number | string>(0)
      await renderInput({
        type: 'number',
        modelValue: modelValue.value,
        'onUpdate:modelValue': (value: any) => {
          modelValue.value = value
        },
      })
      const input = screen.getByRole('textbox')
      await userEvent.clear(input)
      await userEvent.type(input, '.5')
      expect(modelValue.value).toBe(0.5)
    })

    it('should prevent input with more than two decimal places', async () => {
      const modelValue = ref(123.45)
      await renderInput({
        type: 'number',
        modelValue: modelValue.value,
        'onUpdate:modelValue': (value: any) => {
          modelValue.value = value as number
        },
      })
      const input: HTMLInputElement = screen.getByRole('textbox')

      // Try to add a third decimal place
      await userEvent.type(input, '6')

      // Should still show the original value
      expect(input.value).toBe('123.45')
    })

    it('should prevent non-numeric characters', async () => {
      const modelValue = ref(0)
      await renderInput({
        type: 'number',
        modelValue: modelValue.value,
        'onUpdate:modelValue': (value: any) => {
          modelValue.value = value as number
        },
      })
      const input: HTMLInputElement = screen.getByRole('textbox')
      await userEvent.type(input, 'abc')

      // Should remain empty/cleared
      expect(input.value).toBe('0.00')
    })

    it('should set model value to empty string when input is NaN', async () => {
      const modelValue = ref<number | string>(123)
      await renderInput({
        type: 'number',
        modelValue: modelValue.value,
        'onUpdate:modelValue': (value: any) => {
          modelValue.value = value
        },
      })
      const input = screen.getByRole('textbox')
      await userEvent.clear(input)

      expect(modelValue.value).toBe('')
    })

    it('should format number to two decimal places on blur', async () => {
      const modelValue = ref(123)
      await renderInput({
        type: 'number',
        modelValue: modelValue.value,
        'onUpdate:modelValue': (value: any) => {
          modelValue.value = value as number
        },
      })
      const input: HTMLInputElement = screen.getByRole('textbox')
      await userEvent.clear(input)
      await userEvent.type(input, '123')
      await userEvent.tab()

      expect(input.value).toBe('123.00')
    })

    it('should handle undefined model value', async () => {
      await renderInput({
        type: 'number',
        modelValue: undefined,
      })
      const input: HTMLInputElement = screen.getByRole('textbox')
      expect(input.value).toBe('')
    })
  })

  describe('when type is date', () => {
    it('should render input with date type', async () => {
      await renderInput({
        type: 'date',
      })
      const input = screen.getByLabelText('date-picker')
      console.log(input)
      expect(input).toHaveAttribute('type', 'date')
    })

    it('should format date to YYYY-MM-DD on mount', async () => {
      const fakeDate = new Date('2024-01-15').getTime()
      await renderInput({
        type: 'date',
        modelValue: fakeDate,
      })
      const input: HTMLInputElement = screen.getByLabelText('date-picker')
      expect(input.value).toBe('2024-01-15')
    })

    it('should convert date string to timestamp when user changes value', async () => {
      const modelValue = ref<number | Date>(new Date('2024-01-01').getTime())
      await renderInput({
        type: 'date',
        modelValue: modelValue.value,
        'onUpdate:modelValue': (value: number | Date) => {
          modelValue.value = value
        },
      })
      const input: HTMLInputElement = screen.getByLabelText('date-picker')
      await userEvent.clear(input)
      await userEvent.type(input, '2024-12-25')

      expect(modelValue.value).toBe(new Date('2024-12-25').getTime())
    })

    it('should handle Date object as model value', async () => {
      const fakeDate = new Date('2024-01-15')
      await renderInput({
        type: 'date',
        modelValue: fakeDate,
      })
      const input: HTMLInputElement = screen.getByLabelText('date-picker')
      expect(input.value).toBe('2024-01-15')
    })

    it('should handle undefined model value', async () => {
      await renderInput({
        type: 'date',
        modelValue: undefined,
      })
      const input: HTMLInputElement = screen.getByLabelText('date-picker')
      expect(input.value).toBe('')
    })
  })

  describe('when blur event occurs', () => {
    it('should emit blur event', async () => {
      const mockBlurHandler = vi.fn()
      await renderInput({
        onBlur: mockBlurHandler,
      })
      const input = screen.getByRole('textbox')
      await userEvent.click(input)
      await userEvent.tab()

      expect(mockBlurHandler).toHaveBeenCalledTimes(1)
      expect(mockBlurHandler).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('when focus event occurs', () => {
    it('should emit focus event', async () => {
      const mockFocusHandler = vi.fn()
      await renderInput({
        onFocus: mockFocusHandler,
      })
      const input = screen.getByRole('textbox')
      await userEvent.click(input)

      expect(mockFocusHandler).toHaveBeenCalledTimes(1)
      expect(mockFocusHandler).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('when tooltip should be shown', () => {
    beforeEach(() => {
      // Mock scrollWidth and clientWidth for overflow detection
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
        configurable: true,
        value: 200,
      })
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
        configurable: true,
        value: 100,
      })
    })

    afterEach(() => {
      // Reset mocks
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
        configurable: true,
        value: 0,
      })
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
        configurable: true,
        value: 0,
      })
    })

    it('should show tooltip when text is truncated and input is not focused', async () => {
      await renderInput({
        modelValue: 'very long text that will overflow',
      })

      const tooltip = screen.queryByText('very long text that will overflow')
      expect(tooltip).toBeTruthy()
    })

    it('should hide tooltip when input is focused', async () => {
      const { container } = await renderInput({
        modelValue: 'very long text that will overflow',
      })

      const input = screen.getByRole('textbox')
      await userEvent.click(input)

      // Tooltip should be hidden
      const tooltip = container.querySelector('#input-tooltip')
      expect(tooltip).toBeNull()
    })

    it('should show tooltip again when input loses focus', async () => {
      const { container } = await renderInput({
        modelValue: 'very long text that will overflow',
      })

      const input = screen.getByRole('textbox')
      await userEvent.click(input)

      // Tooltip should now be hidden
      let tooltip = container.querySelector('#input-tooltip')
      expect(tooltip).toBeNull()

      await userEvent.tab()
      await nextTick()

      tooltip = screen.queryByText('very long text that will overflow')
      expect(tooltip).toBeTruthy()
    })
  })

  describe('when tooltip should not be shown', () => {
    beforeEach(() => {
      // Mock scrollWidth and clientWidth for no overflow
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
        configurable: true,
        value: 100,
      })
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
        configurable: true,
        value: 200,
      })
    })

    afterEach(() => {
      // Reset mocks
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
        configurable: true,
        value: 0,
      })
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
        configurable: true,
        value: 0,
      })
    })

    it('should not show tooltip when text is not truncated', async () => {
      const { container } = await renderInput({
        modelValue: 'short text',
      })

      const tooltip = container.querySelector('#input-tooltip')
      expect(tooltip).toBeNull()
    })

    it('should not show tooltip when model value is empty', async () => {
      const { container } = await renderInput({
        modelValue: '',
      })

      const tooltip = container.querySelector('#input-tooltip')
      expect(tooltip).toBeNull()
    })
  })

  describe('when additional attributes are passed', () => {
    it('should pass through additional attributes to input', async () => {
      await renderInput({
        placeholder: 'Enter text',
        disabled: true,
        'data-testid': 'custom-input',
      })
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('placeholder', 'Enter text')
      expect(input).toHaveAttribute('disabled')
      expect(input).toHaveAttribute('data-testid', 'custom-input')
    })
  })
})
