import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useDropdownPosition } from '../useDropdownPosition'

const DropdownPositionHarness = defineComponent({
  setup() {
    const fakeTriggerRef = ref<HTMLElement>()
    const fakeOptionsRef = ref<HTMLElement>()
    const fakeIsOptionsOpen = ref(false)

    const { optionsTop, optionsLeft, optionsWidth, positionDropdown } = useDropdownPosition(
      fakeTriggerRef,
      fakeOptionsRef,
    )

    async function openOptions() {
      fakeIsOptionsOpen.value = true
      await positionDropdown(true)
    }

    return {
      fakeTriggerRef,
      fakeOptionsRef,
      fakeIsOptionsOpen,
      optionsTop,
      optionsLeft,
      optionsWidth,
      openOptions,
    }
  },
  template: `<div>
    <button ref="fakeTriggerRef" data-testid="trigger" @click="openOptions">open</button>
    <div
      v-if="fakeIsOptionsOpen"
      ref="fakeOptionsRef"
      data-testid="options"
      :style="{ top: optionsTop + 'px', left: optionsLeft + 'px', width: optionsWidth + 'px' }"
    ></div>
  </div>`,
})

describe('when useDropdownPosition is used in a dropdown', () => {
  it('should use trigger width when trigger width is larger than minimum fallback', async () => {
    render(DropdownPositionHarness)

    const fakeTriggerElement = screen.getByTestId('trigger') as HTMLElement

    Object.defineProperty(fakeTriggerElement, 'offsetWidth', {
      configurable: true,
      value: 240,
    })

    vi.spyOn(fakeTriggerElement, 'getBoundingClientRect').mockReturnValue({
      x: 25,
      y: 80,
      width: 240,
      height: 25,
      top: 80,
      right: 265,
      bottom: 105,
      left: 25,
      toJSON: () => ({}),
    } as DOMRect)

    await userEvent.click(fakeTriggerElement)

    const fakeOptionsElement = screen.getByTestId('options') as HTMLElement
    Object.defineProperty(fakeOptionsElement, 'offsetHeight', {
      configurable: true,
      value: 220,
    })

    window.dispatchEvent(new Event('scroll'))

    expect(fakeOptionsElement.style.width).toBe('240px')
    expect(fakeOptionsElement.style.left).toBe('25px')
    expect(fakeOptionsElement.style.top).toBe('105px')
  })

  it('should apply minimum width fallback and top guard when bottom overflow occurs', async () => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 220,
    })

    render(DropdownPositionHarness)

    const fakeTriggerElement = screen.getByTestId('trigger') as HTMLElement

    Object.defineProperty(fakeTriggerElement, 'offsetWidth', {
      configurable: true,
      value: 100,
    })

    vi.spyOn(fakeTriggerElement, 'getBoundingClientRect').mockReturnValue({
      x: 20,
      y: 100,
      width: 100,
      height: 30,
      top: 100,
      right: 120,
      bottom: 130,
      left: 20,
      toJSON: () => ({}),
    } as DOMRect)

    await userEvent.click(fakeTriggerElement)

    const fakeOptionsElement = screen.getByTestId('options') as HTMLElement

    Object.defineProperty(fakeOptionsElement, 'offsetHeight', {
      configurable: true,
      value: 220,
    })

    window.dispatchEvent(new Event('scroll'))

    expect(fakeOptionsElement.style.width).toBe('160px')
    expect(fakeOptionsElement.style.left).toBe('20px')
    expect(fakeOptionsElement.style.top).toBe('130px')
  })
})
