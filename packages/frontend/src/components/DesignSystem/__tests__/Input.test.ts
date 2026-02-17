import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { nextTick, ref } from 'vue'
import Input from '../Input.vue'

type InputTestProps = Record<string, unknown>

const DATE_PICKER_LABEL = 'date-picker'
const TOOLTIP_SELECTOR = '#input-tooltip'
const OVERFLOW_TEXT = 'very long text that will overflow'

function createVModelProps<T>(initialValue: T) {
  const modelValue = ref<T>(initialValue)
  return {
    modelValue,
    vModelProps: {
      modelValue: modelValue.value,
      'onUpdate:modelValue': (value: T) => {
        modelValue.value = value
      },
    },
  }
}

function getTextbox(): HTMLInputElement | HTMLTextAreaElement {
  return screen.getByRole('textbox') as HTMLInputElement | HTMLTextAreaElement
}

function getDateInput(): HTMLInputElement {
  return screen.getByLabelText(DATE_PICKER_LABEL) as HTMLInputElement
}

function setElementWidthMock(scrollWidth: number, clientWidth: number) {
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    value: scrollWidth,
  })
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    value: clientWidth,
  })
}

async function renderInput(props: InputTestProps = {}, options: InputTestProps = {}) {
  const result = render(Input, { props, ...options })
  await nextTick()
  return result
}

describe('Input', () => {
  it('should display initial model value', async () => {
    await renderInput({
      modelValue: 'initial value',
    })
    const input = getTextbox()
    expect(input.value).toBe('initial value')
  })

  it('should update model value when user types', async () => {
    const { modelValue, vModelProps } = createVModelProps('')
    await renderInput({
      ...vModelProps,
    })
    const input = getTextbox()
    await userEvent.type(input, 'test input')

    expect(modelValue.value).toBe('test input')
    expect(input.value).toBe('test input')
  })

  it('should update display when model value changes externally', async () => {
    const { modelValue } = createVModelProps('initial')
    const { rerender } = await renderInput({
      modelValue: modelValue.value,
    })
    let input = getTextbox()
    expect(input.value).toBe('initial')

    await rerender({ modelValue: 'updated' })
    input = getTextbox()
    expect(input.value).toBe('updated')
  })

  describe('when type is string', () => {
    it('should render input with string type', async () => {
      await renderInput({
        type: 'string',
      })
      const input = getTextbox()
      expect(input).toHaveAttribute('type', 'string')
    })
  })

  describe('when type is number', () => {
    it('should render input with text type', async () => {
      await renderInput({
        type: 'number',
      })
      const input = getTextbox()
      expect(input).toHaveAttribute('type', 'text')
    })

    it('should format number with two decimal places on mount', async () => {
      await renderInput({
        type: 'number',
        modelValue: 123.4,
      })
      const input = getTextbox()
      expect(input.value).toBe('123.40')
    })

    it('should allow valid number input', async () => {
      const { modelValue, vModelProps } = createVModelProps<number | string>(0)
      await renderInput({
        type: 'number',
        ...vModelProps,
      })

      const input = getTextbox()

      await userEvent.clear(input)
      await userEvent.type(input, '123.45')
      expect(modelValue.value).toBe(123.45)
    })

    it('should allow integer input', async () => {
      const { modelValue, vModelProps } = createVModelProps<number | string>(0)
      await renderInput({
        type: 'number',
        ...vModelProps,
      })
      const input = getTextbox()
      await userEvent.clear(input)
      await userEvent.type(input, '123')
      expect(modelValue.value).toBe(123)
    })

    it('should allow decimal input without leading zero', async () => {
      const { modelValue, vModelProps } = createVModelProps<number | string>(0)
      await renderInput({
        type: 'number',
        ...vModelProps,
      })
      const input = getTextbox()
      await userEvent.clear(input)
      await userEvent.type(input, '.5')
      expect(modelValue.value).toBe(0.5)
    })

    it('should prevent input with more than two decimal places', async () => {
      const { modelValue, vModelProps } = createVModelProps(123.45)
      await renderInput({
        type: 'number',
        ...vModelProps,
      })
      const input = getTextbox()

      // Try to add a third decimal place
      await userEvent.type(input, '6')

      // Should still show the original value
      expect(input.value).toBe('123.45')
    })

    it('should prevent non-numeric characters', async () => {
      const { modelValue, vModelProps } = createVModelProps(0)
      await renderInput({
        type: 'number',
        ...vModelProps,
      })
      const input = getTextbox()
      await userEvent.type(input, 'abc')

      // Should remain empty/cleared
      expect(input.value).toBe('0.00')
    })

    it('should set model value to empty string when input is NaN', async () => {
      const { modelValue, vModelProps } = createVModelProps<number | string>(123)
      await renderInput({
        type: 'number',
        ...vModelProps,
      })
      const input = getTextbox()
      await userEvent.clear(input)

      expect(modelValue.value).toBe('')
    })

    it('should format number to two decimal places on blur', async () => {
      const { modelValue, vModelProps } = createVModelProps(123)
      await renderInput({
        type: 'number',
        ...vModelProps,
      })
      const input = getTextbox()
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
      const input = getTextbox()
      expect(input.value).toBe('')
    })
  })

  describe('when type is date', () => {
    it('should render input with date type', async () => {
      await renderInput({
        type: 'date',
      })
      const input = getDateInput()
      expect(input).toHaveAttribute('type', 'date')
    })

    it('should format date to YYYY-MM-DD on mount', async () => {
      const fakeDate = new Date('2024-01-15').getTime()
      await renderInput({
        type: 'date',
        modelValue: fakeDate,
      })
      const input = getDateInput()
      expect(input.value).toBe('2024-01-15')
    })

    it('should convert date string to timestamp when user changes value', async () => {
      const { modelValue, vModelProps } = createVModelProps<number | Date>(
        new Date('2024-01-01').getTime(),
      )
      await renderInput({
        type: 'date',
        ...vModelProps,
      })
      const input = getDateInput()
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
      const input = getDateInput()
      expect(input.value).toBe('2024-01-15')
    })

    it('should handle undefined model value', async () => {
      await renderInput({
        type: 'date',
        modelValue: undefined,
      })
      const input = getDateInput()
      expect(input.value).toBe('')
    })
  })

  describe('when blur event occurs', () => {
    it('should emit blur event', async () => {
      const mockBlurHandler = vi.fn()
      await renderInput({
        onBlur: mockBlurHandler,
      })
      const input = getTextbox()
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
      const input = getTextbox()
      await userEvent.click(input)

      expect(mockFocusHandler).toHaveBeenCalledTimes(1)
      expect(mockFocusHandler).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('when tooltip should be shown', () => {
    beforeEach(() => {
      setElementWidthMock(200, 100)
    })

    afterEach(() => {
      setElementWidthMock(0, 0)
    })

    it('should show tooltip when text is truncated and input is not focused', async () => {
      await renderInput({
        modelValue: OVERFLOW_TEXT,
      })

      const tooltip = screen.queryByText(OVERFLOW_TEXT)
      expect(tooltip).toBeTruthy()
    })

    it('should hide tooltip when input is focused', async () => {
      const { container } = await renderInput({
        modelValue: OVERFLOW_TEXT,
      })

      const input = getTextbox()
      await userEvent.click(input)

      // Tooltip should be hidden
      const tooltip = container.querySelector(TOOLTIP_SELECTOR)
      expect(tooltip).toBeNull()
    })

    it('should show tooltip again when input loses focus', async () => {
      const { container } = await renderInput({
        modelValue: OVERFLOW_TEXT,
      })

      const input = getTextbox()
      await userEvent.click(input)

      // Tooltip should now be hidden
      let tooltip = container.querySelector(TOOLTIP_SELECTOR)
      expect(tooltip).toBeNull()

      await userEvent.tab()
      await nextTick()

      tooltip = screen.queryByText(OVERFLOW_TEXT)
      expect(tooltip).toBeTruthy()
    })
  })

  describe('when tooltip should not be shown', () => {
    beforeEach(() => {
      setElementWidthMock(100, 200)
    })

    afterEach(() => {
      setElementWidthMock(0, 0)
    })

    it('should not show tooltip when text is not truncated', async () => {
      const { container } = await renderInput({
        modelValue: 'short text',
      })

      const tooltip = container.querySelector(TOOLTIP_SELECTOR)
      expect(tooltip).toBeNull()
    })

    it('should not show tooltip when model value is empty', async () => {
      const { container } = await renderInput({
        modelValue: '',
      })

      const tooltip = container.querySelector(TOOLTIP_SELECTOR)
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
      const input = getTextbox()
      expect(input).toHaveAttribute('placeholder', 'Enter text')
      expect(input).toHaveAttribute('disabled')
      expect(input).toHaveAttribute('data-testid', 'custom-input')
    })
  })

  describe('when variant is textarea', () => {
    it('should render textarea element instead of input', async () => {
      await renderInput({
        variant: 'textarea',
        modelValue: 'test value',
      })
      const textarea = getTextbox()
      expect(textarea.tagName).toBe('TEXTAREA')
    })

    it('should start with 1 row', async () => {
      await renderInput({
        variant: 'textarea',
      })
      const textarea = getTextbox()
      expect(textarea).toHaveAttribute('rows', '1')
    })

    it('should update model value when user types', async () => {
      const { modelValue, vModelProps } = createVModelProps('')
      await renderInput({
        variant: 'textarea',
        ...vModelProps,
      })
      const textarea = getTextbox()
      await userEvent.type(textarea, 'test input')

      expect(modelValue.value).toBe('test input')
      expect(textarea).toHaveValue('test input')
    })

    it('should auto-grow height when content is added', async () => {
      const { modelValue, vModelProps } = createVModelProps('')
      await renderInput({
        variant: 'textarea',
        ...vModelProps,
      })
      const textarea = getTextbox() as HTMLTextAreaElement

      // Mock scrollHeight to simulate content growth
      Object.defineProperty(textarea, 'scrollHeight', {
        configurable: true,
        value: 100,
      })

      await userEvent.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3')

      // Height should be set to scrollHeight
      expect(textarea.style.height).toBe('100px')
    })

    it('should not show tooltip for textarea variant', async () => {
      const { container } = await renderInput({
        variant: 'textarea',
        modelValue: 'This is a very long text that would normally trigger a tooltip in input mode',
      })

      const tooltip = container.querySelector(TOOLTIP_SELECTOR)
      expect(tooltip).toBeNull()
    })

    it('should emit blur event when textarea loses focus', async () => {
      const blurHandler = vi.fn()
      await renderInput({
        variant: 'textarea',
        onBlur: blurHandler,
      })
      const textarea = getTextbox()

      await userEvent.click(textarea)
      await userEvent.tab()

      expect(blurHandler).toHaveBeenCalled()
    })

    it('should emit focus event when textarea gains focus', async () => {
      const focusHandler = vi.fn()
      await renderInput({
        variant: 'textarea',
        onFocus: focusHandler,
      })
      const textarea = getTextbox()

      await userEvent.click(textarea)

      expect(focusHandler).toHaveBeenCalled()
    })

    it('should have correct CSS classes for textarea', async () => {
      await renderInput({
        variant: 'textarea',
      })
      const textarea = getTextbox()

      expect(textarea).toHaveClass('w-full')
      expect(textarea).toHaveClass('px-2')
      expect(textarea).toHaveClass('rounded-sm')
      expect(textarea).toHaveClass('resize-none')
      expect(textarea).toHaveClass('overflow-hidden')
      expect(textarea).not.toHaveClass('truncate')
    })

    it('should pass through additional attributes to textarea', async () => {
      await renderInput({
        variant: 'textarea',
        placeholder: 'Enter multiline text',
        disabled: true,
        'data-testid': 'custom-textarea',
      })
      const textarea = getTextbox()
      expect(textarea).toHaveAttribute('placeholder', 'Enter multiline text')
      expect(textarea).toHaveAttribute('disabled')
      expect(textarea).toHaveAttribute('data-testid', 'custom-textarea')
    })
  })
})
