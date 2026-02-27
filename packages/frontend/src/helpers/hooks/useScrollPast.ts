import { onMounted, onUnmounted, ref, type Ref } from 'vue'

type UseScrollPastOptions = {
  triggerOffsetPx?: number
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
    const scrollThreshold = initialOffsetTop.value - triggerOffsetPx

    hasScrolledPast.value = scrollPosition > scrollThreshold
  }

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
