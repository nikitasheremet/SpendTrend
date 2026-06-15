import { onMounted, onUnmounted, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

type UseScrollPastOptions = {
  triggerOffsetPx?: MaybeRefOrGetter<number>
}

export function useScrollPast(
  elementRef: Ref<HTMLElement | null>,
  { triggerOffsetPx = 0 }: UseScrollPastOptions = {},
) {
  const hasScrolledPast = ref(false)
  const initialOffsetTop = ref<number | null>(null)

  function checkScrollPosition() {
    if (!elementRef.value) {
      return
    }

    if (initialOffsetTop.value === null) {
      initialOffsetTop.value = elementRef.value.offsetTop
    }

    const scrollPosition = window.scrollY || window.pageYOffset
    const scrollThreshold = initialOffsetTop.value - toValue(triggerOffsetPx)

    hasScrolledPast.value = scrollPosition > scrollThreshold
  }

  // Re-check when the trigger offset itself changes (e.g. a sticky element
  // above this one resizes), not just on scroll/mount.
  watch(() => toValue(triggerOffsetPx), checkScrollPosition)

  onMounted(() => {
    checkScrollPosition()
    window.addEventListener('scroll', checkScrollPosition)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', checkScrollPosition)
  })

  return {
    hasScrolledPast,
  }
}
