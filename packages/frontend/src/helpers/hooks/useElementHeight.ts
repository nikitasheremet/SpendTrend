import { onMounted, onUnmounted, ref, type Ref } from 'vue'

const ZERO_HEIGHT_PX = 0

export function useElementHeight(elementRef: Ref<HTMLElement | null>) {
  const height = ref(ZERO_HEIGHT_PX)
  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    if (!elementRef.value) {
      return
    }

    height.value = elementRef.value.offsetHeight

    resizeObserver = new ResizeObserver(([entry]) => {
      height.value = entry.borderBoxSize?.[0]?.blockSize ?? entry.target.getBoundingClientRect().height
    })
    resizeObserver.observe(elementRef.value)
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
  })

  return height
}
