import { fireEvent, render, screen } from '@testing-library/vue'
import { defineComponent, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useScrollPast } from '../useScrollPast'

const SCROLLED_PAST_TEXT = 'scrolled past'
const NOT_SCROLLED_PAST_TEXT = 'not scrolled past'

const ScrollPastHarness = defineComponent({
  props: {
    triggerOffsetPx: { type: Number, default: 0 },
    inScrollContainer: { type: Boolean, default: false },
  },
  setup(props) {
    const targetRef = ref<HTMLElement | null>(null)
    const { hasScrolledPast } = useScrollPast(targetRef, {
      triggerOffsetPx: () => props.triggerOffsetPx,
    })
    return { targetRef, hasScrolledPast }
  },
  template: `<div data-testid="scroll-container" :style="inScrollContainer ? 'overflow-y: auto' : ''">
    <div ref="targetRef" data-testid="target">
      {{ hasScrolledPast ? '${SCROLLED_PAST_TEXT}' : '${NOT_SCROLLED_PAST_TEXT}' }}
    </div>
  </div>`,
})

afterEach(() => {
  vi.restoreAllMocks()
  window.scrollY = 0
})

describe('useScrollPast', () => {
  describe('when the element is inside a scroll container', () => {
    it('reports scrolled past once the container scrolls beyond the element', async () => {
      mockTopsByTestId({ 'scroll-container': 100, target: 300 })
      render(ScrollPastHarness, { props: { inScrollContainer: true } })
      const container = screen.getByTestId('scroll-container')

      await scrollContainerTo(container, 150)
      expect(screen.getByText(NOT_SCROLLED_PAST_TEXT)).toBeInTheDocument()

      await scrollContainerTo(container, 250)
      expect(screen.getByText(SCROLLED_PAST_TEXT)).toBeInTheDocument()
    })

    it('applies the trigger offset relative to the container', async () => {
      mockTopsByTestId({ 'scroll-container': 100, target: 300 })
      render(ScrollPastHarness, { props: { inScrollContainer: true, triggerOffsetPx: 60 } })

      await scrollContainerTo(screen.getByTestId('scroll-container'), 150)

      expect(screen.getByText(SCROLLED_PAST_TEXT)).toBeInTheDocument()
    })

    it('ignores window scrolling', async () => {
      mockTopsByTestId({ 'scroll-container': 100, target: 300 })
      render(ScrollPastHarness, { props: { inScrollContainer: true } })

      window.scrollY = 1000
      await fireEvent.scroll(window)

      expect(screen.getByText(NOT_SCROLLED_PAST_TEXT)).toBeInTheDocument()
    })
  })

  describe('when the element is not inside a scroll container', () => {
    it('reports scrolled past once the window scrolls beyond the element', async () => {
      vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockReturnValue(200)
      render(ScrollPastHarness)

      window.scrollY = 150
      await fireEvent.scroll(window)
      expect(screen.getByText(NOT_SCROLLED_PAST_TEXT)).toBeInTheDocument()

      window.scrollY = 250
      await fireEvent.scroll(window)
      expect(screen.getByText(SCROLLED_PAST_TEXT)).toBeInTheDocument()
    })
  })
})

function mockTopsByTestId(topsByTestId: Record<string, number>) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    const top = topsByTestId[this.dataset.testid ?? ''] ?? 0
    return { top, bottom: top, left: 0, right: 0, width: 0, height: 0, x: 0, y: top } as DOMRect
  })
}

async function scrollContainerTo(container: HTMLElement, scrollTop: number) {
  container.scrollTop = scrollTop
  await fireEvent.scroll(container)
}
