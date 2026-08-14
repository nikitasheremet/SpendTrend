import { ref, type Ref } from 'vue'

export function useControlCategoryOptions(): {
  isOptionsOpen: Ref<boolean>
  toggleOptions: () => void
  closeOptions: () => void
} {
  const isOptionsOpen = ref(false)

  function toggleOptions() {
    isOptionsOpen.value = !isOptionsOpen.value
  }

  function closeOptions() {
    isOptionsOpen.value = false
  }

  return {
    isOptionsOpen,
    toggleOptions,
    closeOptions,
  }
}
