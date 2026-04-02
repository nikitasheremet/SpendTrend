import { computed, defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useProgressiveRowRender } from '../useProgressiveRowRender'

const BASE_ROW_COUNT = 10
const ROW_ID_OFFSET = 1
const INITIAL_FRAME_ID = 0
const FRAME_TIME_STAMP = 0
const INITIAL_DISABLED_ROW_COUNT = 3
const DISABLED_ROW_CHUNK_SIZE = 2
const INITIAL_ENABLED_ROW_COUNT = 4
const ENABLED_ROW_CHUNK_SIZE = 3
const SHRINK_TEST_INITIAL_ROW_COUNT = 3
const SHRINK_TEST_ROW_CHUNK_SIZE = 3
const EXPECTED_INITIAL_VISIBLE_MIN = 4
const REMOVED_ROW_INDEX = 4
const EXPECTED_ROW_COUNT_AFTER_DELETE = 9
const DELETE_ONE_ROW_COUNT = 1

const flushPromises = async () => {
  await Promise.resolve()
  await nextTick()
}

const TestHost = defineComponent({
  props: {
    enabled: {
      type: Boolean,
      required: true,
    },
    initialRowCount: {
      type: Number,
      required: true,
    },
    rowChunkSize: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const fakeData = ref(
      Array.from({ length: BASE_ROW_COUNT }, (_, index) => ({ id: index + ROW_ID_OFFSET })),
    )
    const { visibleData } = useProgressiveRowRender({
      data: computed(() => fakeData.value),
      enabled: computed(() => props.enabled),
      initialRowCount: computed(() => props.initialRowCount),
      rowChunkSize: computed(() => props.rowChunkSize),
    })

    function removeRow(index: number) {
      fakeData.value.splice(index, DELETE_ONE_ROW_COUNT)
    }

    return { visibleData, removeRow }
  },
  template: '<div>{{ visibleData.length }}</div>',
})

describe('when useProgressiveRowRender is used', () => {
  const fakeRequestAnimationFrame = vi.fn<(callback: FrameRequestCallback) => number>()
  const fakeCancelAnimationFrame = vi.fn<(handle: number) => void>()

  beforeEach(() => {
    let fakeFrameId = INITIAL_FRAME_ID
    fakeRequestAnimationFrame.mockImplementation((callback) => {
      const fakeCurrentId = ++fakeFrameId
      Promise.resolve().then(() => callback(FRAME_TIME_STAMP))
      return fakeCurrentId
    })
    fakeCancelAnimationFrame.mockImplementation(() => undefined)

    vi.stubGlobal('requestAnimationFrame', fakeRequestAnimationFrame)
    vi.stubGlobal('cancelAnimationFrame', fakeCancelAnimationFrame)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('should return all rows immediately when progressive rendering is disabled', async () => {
    const wrapper = mount(TestHost, {
      props: {
        enabled: false,
        initialRowCount: INITIAL_DISABLED_ROW_COUNT,
        rowChunkSize: DISABLED_ROW_CHUNK_SIZE,
      },
    })

    await flushPromises()

    expect(wrapper.text()).toBe(String(BASE_ROW_COUNT))
  })

  it('should progressively grow visible rows when enabled', async () => {
    const wrapper = mount(TestHost, {
      props: {
        enabled: true,
        initialRowCount: INITIAL_ENABLED_ROW_COUNT,
        rowChunkSize: ENABLED_ROW_CHUNK_SIZE,
      },
    })

    await nextTick()
    expect(Number(wrapper.text())).toBeGreaterThanOrEqual(EXPECTED_INITIAL_VISIBLE_MIN)

    await flushPromises()
    await flushPromises()

    expect(wrapper.text()).toBe(String(BASE_ROW_COUNT))
  })

  it('should not reset visible rows to initial count when data shrinks', async () => {
    const wrapper = mount(TestHost, {
      props: {
        enabled: true,
        initialRowCount: SHRINK_TEST_INITIAL_ROW_COUNT,
        rowChunkSize: SHRINK_TEST_ROW_CHUNK_SIZE,
      },
    })

    await flushPromises()
    await flushPromises()

    expect(wrapper.text()).toBe(String(BASE_ROW_COUNT))
    ;(wrapper.vm as { removeRow: (index: number) => void }).removeRow(REMOVED_ROW_INDEX)
    await nextTick()

    expect(wrapper.text()).toBe(String(EXPECTED_ROW_COUNT_AFTER_DELETE))
  })
})
