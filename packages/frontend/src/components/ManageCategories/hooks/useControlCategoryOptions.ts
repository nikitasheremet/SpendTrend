import { sleep } from '@/helpers/sleep'
import { nextTick, ref, type Ref } from 'vue'

export function useControlCategoryOptions(): {
  isOptionsOpen: Ref<boolean>
  isOptionsClosing: Ref<boolean>
  toggleOptions: () => void
  closeOptions: () => void
  hideOptionsImmediately: () => void
} {
  const isOptionsOpen = ref(false)
  const isOptionsClosing = ref(false)

  function toggleOptions() {
    isOptionsOpen.value = !isOptionsOpen.value
    isOptionsClosing.value = false
  }

  function hideOptionsImmediately() {
    isOptionsClosing.value = true
  }

  async function closeOptions() {
    const ONE_HUNDRED_MS_TO_ALLOW_MODAL_TO_OPEN = 100
    await sleep(ONE_HUNDRED_MS_TO_ALLOW_MODAL_TO_OPEN)
    await nextTick()
    isOptionsOpen.value = false
  }

  return {
    isOptionsOpen,
    isOptionsClosing,
    toggleOptions,
    closeOptions,
    hideOptionsImmediately,
  }
}
