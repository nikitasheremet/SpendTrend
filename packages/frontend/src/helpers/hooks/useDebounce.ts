import { ref, onBeforeUnmount } from 'vue'

export function useDebounce(callback: (...args: unknown[]) => void, delayMs: number) {
  const timeoutId = ref<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup timeout on unmount
  onBeforeUnmount(() => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
    }
  })

  const debouncedFn = (...args: unknown[]) => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
    }
    timeoutId.value = setTimeout(() => callback(...args), delayMs)
  }

  return debouncedFn
}
