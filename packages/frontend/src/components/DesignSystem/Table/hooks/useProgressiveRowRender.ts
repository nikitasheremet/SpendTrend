import { computed, onBeforeUnmount, onMounted, ref, watch, type ComputedRef } from 'vue'

const DEFAULT_INITIAL_ROW_COUNT = 5
const DEFAULT_ROW_CHUNK_SIZE = 5
const ZERO_COUNT = 0

export interface ProgressiveRowRenderOptions<T> {
  data: ComputedRef<T[]>
  enabled: ComputedRef<boolean>
  initialRowCount: ComputedRef<number | undefined>
  rowChunkSize: ComputedRef<number | undefined>
}

export interface ProgressiveRowRenderReturn<T> {
  visibleData: ComputedRef<T[]>
}

export function useProgressiveRowRender<T>(
  options: ProgressiveRowRenderOptions<T>,
): ProgressiveRowRenderReturn<T> {
  const renderedRowCount = ref(ZERO_COUNT)
  let animationFrameId: number | undefined

  const resolvedInitialRowCount = computed(
    () => options.initialRowCount.value ?? DEFAULT_INITIAL_ROW_COUNT,
  )
  const resolvedRowChunkSize = computed(() => options.rowChunkSize.value ?? DEFAULT_ROW_CHUNK_SIZE)

  function cancelPendingRender() {
    if (animationFrameId !== undefined) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = undefined
    }
  }

  function scheduleRemainingRows() {
    cancelPendingRender()

    if (!options.enabled.value) {
      renderedRowCount.value = options.data.value.length
      return
    }

    if (options.data.value.length <= renderedRowCount.value) {
      return
    }

    const addRows = () => {
      renderedRowCount.value = Math.min(
        options.data.value.length,
        renderedRowCount.value + resolvedRowChunkSize.value,
      )

      if (renderedRowCount.value < options.data.value.length) {
        animationFrameId = requestAnimationFrame(addRows)
        return
      }

      animationFrameId = undefined
    }

    animationFrameId = requestAnimationFrame(addRows)
  }

  function resetRenderWindow() {
    if (!options.enabled.value) {
      renderedRowCount.value = options.data.value.length
      return
    }

    renderedRowCount.value = Math.min(options.data.value.length, resolvedInitialRowCount.value)
    scheduleRemainingRows()
  }

  onMounted(() => {
    resetRenderWindow()
  })

  watch(
    [
      () => options.data.value.length,
      () => options.enabled.value,
      () => resolvedInitialRowCount.value,
      () => resolvedRowChunkSize.value,
    ],
    (currentValues, previousValues) => {
      const [currentLength, currentEnabled, currentInitialCount, currentChunkSize] = currentValues
      const [previousLength, previousEnabled, previousInitialCount, previousChunkSize] =
        previousValues

      if (currentEnabled !== previousEnabled) {
        resetRenderWindow()
        return
      }

      if (!currentEnabled) {
        renderedRowCount.value = currentLength
        cancelPendingRender()
        return
      }

      if (currentInitialCount !== previousInitialCount || currentChunkSize !== previousChunkSize) {
        resetRenderWindow()
        return
      }

      if (currentLength < previousLength) {
        renderedRowCount.value = Math.min(renderedRowCount.value, currentLength)
        cancelPendingRender()
        return
      }

      if (currentLength > previousLength) {
        scheduleRemainingRows()
      }
    },
  )

  onBeforeUnmount(() => {
    cancelPendingRender()
  })

  const visibleData = computed(() => {
    if (!options.enabled.value) {
      return options.data.value
    }

    return options.data.value.slice(ZERO_COUNT, renderedRowCount.value)
  })

  return {
    visibleData,
  }
}
