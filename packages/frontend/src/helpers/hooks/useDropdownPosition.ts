import { ref, nextTick, type Ref, onMounted, onUnmounted } from 'vue'

export function useDropdownPosition(
  optionsRef: Ref<HTMLElement | undefined>,
  optionsDivRef: Ref<HTMLElement | undefined>,
) {
  const optionsTop = ref(0)
  const optionsLeft = ref(0)

  function updatePosition() {
    if (optionsRef.value && optionsDivRef.value) {
      const triggerElementRect = getTriggerElementRect(optionsRef)
      const { initialDropdownTop, initialDropdownLeft } =
        calculateInitialPosition(triggerElementRect)
      optionsTop.value = initialDropdownTop
      optionsLeft.value = initialDropdownLeft
      const dropdownElement = optionsDivRef.value
      const dropdownHeightWithPadding = dropdownElement.offsetHeight + 5
      const viewportHeight = window.innerHeight
      optionsTop.value = adjustPositionIfCutoff(
        triggerElementRect,
        dropdownHeightWithPadding,
        viewportHeight,
        optionsTop.value,
      )
    }
  }

  onMounted(() => {
    const handleScroll = () => {
      updatePosition()
    }
    window.addEventListener('scroll', handleScroll, true)
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll, true)
    })
  })

  async function positionDropdown(isOptionsOpen: boolean) {
    if (isOptionsOpen) {
      await nextTick()
      updatePosition()
    }
  }

  return {
    optionsTop,
    optionsLeft,
    positionDropdown,
  }
}

function calculateInitialPosition(triggerElementRect: DOMRect): {
  initialDropdownTop: number
  initialDropdownLeft: number
} {
  const initialDropdownTop = triggerElementRect.bottom
  const initialDropdownLeft = triggerElementRect.left
  return { initialDropdownTop, initialDropdownLeft }
}

function adjustPositionIfCutoff(
  triggerElementRect: DOMRect,
  dropdownHeightWithPadding: number,
  viewportHeight: number,
  currentTop: number,
): number {
  const dropdownBottomPosition = currentTop + dropdownHeightWithPadding
  if (dropdownBottomPosition > viewportHeight) {
    return triggerElementRect.top - dropdownHeightWithPadding
  }
  return currentTop
}

function getTriggerElementRect(optionsRef: Ref<HTMLElement | undefined>): DOMRect {
  return optionsRef.value!.getBoundingClientRect()
}
