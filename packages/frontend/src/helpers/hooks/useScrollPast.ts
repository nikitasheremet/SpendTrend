import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useScrollPast(elementRef: Ref<HTMLElement | null>) {
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
    const scrollThreshold = initialOffsetTop.value

    console.log(
      'Scroll Position:',
      scrollPosition,
      'Threshold:',
      scrollThreshold,
      scrollPosition >= scrollThreshold,
    )

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
