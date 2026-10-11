import { onMounted, onUnmounted, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

const SCROLLABLE_OVERFLOW_VALUES = ['auto', 'scroll', 'overlay']

type UseScrollPastOptions = {
  triggerOffsetPx?: MaybeRefOrGetter<number>
}

export function useScrollPast(
  elementRef: Ref<HTMLElement | null>,
  { triggerOffsetPx = 0 }: UseScrollPastOptions = {},
) {
  const hasScrolledPast = ref(false)
  const initialOffsetTop = ref<number | null>(null)
  // The nearest scrolling ancestor (e.g. a modal body), or null when the
  // element scrolls with the window.
  let scrollContainer: HTMLElement | null = null

  function checkScrollPosition() {
    if (!elementRef.value) {
      return
    }

    if (initialOffsetTop.value === null) {
      initialOffsetTop.value = getOffsetTopWithin(elementRef.value, scrollContainer)
    }

    const scrollPosition = scrollContainer
      ? scrollContainer.scrollTop
      : window.scrollY || window.pageYOffset
    const scrollThreshold = initialOffsetTop.value - toValue(triggerOffsetPx)

    hasScrolledPast.value = scrollPosition > scrollThreshold
  }

  // Re-check when the trigger offset itself changes (e.g. a sticky element
  // above this one resizes), not just on scroll/mount.
  watch(() => toValue(triggerOffsetPx), checkScrollPosition)

  onMounted(() => {
    scrollContainer = findScrollContainer(elementRef.value)
    checkScrollPosition()
    getScrollTarget().addEventListener('scroll', checkScrollPosition)
  })

  onUnmounted(() => {
    getScrollTarget().removeEventListener('scroll', checkScrollPosition)
  })

  function getScrollTarget(): HTMLElement | Window {
    return scrollContainer ?? window
  }

  return {
    hasScrolledPast,
  }
}

function findScrollContainer(element: HTMLElement | null): HTMLElement | null {
  let ancestor = element?.parentElement ?? null
  while (ancestor) {
    if (SCROLLABLE_OVERFLOW_VALUES.includes(getComputedStyle(ancestor).overflowY)) {
      return ancestor
    }
    ancestor = ancestor.parentElement
  }
  return null
}

function getOffsetTopWithin(element: HTMLElement, scrollContainer: HTMLElement | null): number {
  if (!scrollContainer) {
    return element.offsetTop
  }

  return (
    element.getBoundingClientRect().top -
    scrollContainer.getBoundingClientRect().top +
    scrollContainer.scrollTop
  )
}
