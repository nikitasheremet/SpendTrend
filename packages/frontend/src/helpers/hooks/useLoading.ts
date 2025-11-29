import { ref } from 'vue'

export function useLoading(options: { delay?: number } = {}) {
  const delay = options.delay ?? 1000
  const loading = ref(false)

  function startLoading() {
    loading.value = true
  }

  function stopLoading() {
    setTimeout(() => {
      loading.value = false
    }, delay)
  }

  return {
    loading,
    startLoading,
    stopLoading,
  }
}
