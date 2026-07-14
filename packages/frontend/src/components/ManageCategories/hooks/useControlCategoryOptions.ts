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

  /**
   * Set true by the consumer when an option is selected, to hide the dropdown before the
   * 100ms delay in closeOptions() actually unmounts it (see closeOptions for why that delay
   * exists). Bind this to an `opacity-0` class, NOT `invisible`/`visibility: hidden` or
   * `hidden`/`display: none`: those remove the element from hit-testing, and since this flips
   * synchronously inside the option's own `mousedown` handler, the browser can retarget the
   * still-in-flight `mouseup`/`click` of that same gesture away from the (now unhittable)
   * option button — observed landing on `document.body` — which useClickOutside then
   * legitimately reads as a click outside the panel and closes it. `opacity-0` hides the
   * pixels without touching hit-testing, so the in-flight click resolves normally.
   */
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
