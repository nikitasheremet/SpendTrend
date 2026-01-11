import { ref, nextTick, type Ref } from 'vue'

export function useDropdownPosition() {
  const optionsRef = ref<HTMLElement>()
  const optionsDivRef = ref<HTMLElement>()
  const optionsTop = ref(0)
  const optionsLeft = ref(0)

  async function positionDropdown(isOptionsOpen: boolean) {
    if (isOptionsOpen) {
      await nextTick()
      setInitialPosition(optionsRef, optionsTop, optionsLeft)
      await nextTick()
      if (optionsDivRef.value) {
        const dropdownElement = optionsDivRef.value
        const dropdownHeightWithPadding = dropdownElement.offsetHeight + 5
        const viewportHeight = window.innerHeight
        optionsTop.value = adjustPositionIfCutoff(
          getTriggerElementRect(optionsRef),
          dropdownHeightWithPadding,
          viewportHeight,
          optionsTop.value,
        )
      }
    }
  }

  return {
    optionsRef,
    optionsDivRef,
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

function setInitialPosition(
  optionsRef: Ref<HTMLElement | undefined>,
  optionsTop: Ref<number>,
  optionsLeft: Ref<number>,
) {
  if (optionsRef.value) {
    const triggerElementRect = getTriggerElementRect(optionsRef)
    const { initialDropdownTop, initialDropdownLeft } = calculateInitialPosition(triggerElementRect)
    optionsTop.value = initialDropdownTop
    optionsLeft.value = initialDropdownLeft
  }
}
