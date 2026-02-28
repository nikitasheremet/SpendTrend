import { ref, nextTick, type Ref, onMounted, onUnmounted } from 'vue'

const DROPDOWN_VIEWPORT_PADDING_PX = 5
const DROPDOWN_TOP_GUARD_PX = 8
const DROPDOWN_MIN_WIDTH_PX = 160
type SupportedElement = HTMLElement | { $el?: HTMLElement }

export function useDropdownPosition(
  optionsRef: Ref<SupportedElement | undefined>,
  optionsDivRef: Ref<SupportedElement | undefined>,
) {
  const optionsTop = ref(0)
  const optionsLeft = ref(0)
  const optionsWidth = ref(DROPDOWN_MIN_WIDTH_PX)

  function updatePosition() {
    const triggerElement = getElement(optionsRef)
    const dropdownElement = getElement(optionsDivRef)

    if (triggerElement && dropdownElement) {
      const triggerElementRect = getTriggerElementRect(optionsRef)
      const { initialDropdownTop, initialDropdownLeft } =
        calculateInitialPosition(triggerElementRect)
      optionsTop.value = initialDropdownTop
      optionsLeft.value = initialDropdownLeft
      optionsWidth.value = calculateDropdownWidth(optionsRef)
      const dropdownHeightWithPadding = dropdownElement.offsetHeight + DROPDOWN_VIEWPORT_PADDING_PX
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
    const handlePositionChange = () => {
      updatePosition()
    }
    window.addEventListener('scroll', handlePositionChange, true)
    window.addEventListener('resize', handlePositionChange)
    onUnmounted(() => {
      window.removeEventListener('scroll', handlePositionChange, true)
      window.removeEventListener('resize', handlePositionChange)
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
    optionsWidth,
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
    const dropdownTopPosition = triggerElementRect.top - dropdownHeightWithPadding
    return Math.max(dropdownTopPosition, DROPDOWN_TOP_GUARD_PX)
  }
  return currentTop
}

function calculateDropdownWidth(optionsRef: Ref<SupportedElement | undefined>): number {
  const triggerWidth = getElement(optionsRef)?.offsetWidth ?? 0
  return Math.max(triggerWidth, DROPDOWN_MIN_WIDTH_PX)
}

function getTriggerElementRect(optionsRef: Ref<SupportedElement | undefined>): DOMRect {
  return getElement(optionsRef)!.getBoundingClientRect()
}

function getElement(elementRef: Ref<SupportedElement | undefined>): HTMLElement | undefined {
  if (!elementRef.value) {
    return undefined
  }

  if (elementRef.value instanceof HTMLElement) {
    return elementRef.value
  }

  return elementRef.value.$el
}
