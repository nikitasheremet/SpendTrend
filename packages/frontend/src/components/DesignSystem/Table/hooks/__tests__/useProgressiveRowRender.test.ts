import { computed, defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useProgressiveRowRender } from '../useProgressiveRowRender'

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
    const fakeData = ref(Array.from({ length: 10 }, (_, index) => ({ id: index + 1 })))
    const { visibleData } = useProgressiveRowRender({
      data: computed(() => fakeData.value),
      enabled: computed(() => props.enabled),
      initialRowCount: computed(() => props.initialRowCount),
      rowChunkSize: computed(() => props.rowChunkSize),
    })

    return { visibleData }
  },
  template: '<div>{{ visibleData.length }}</div>',
})

describe('when useProgressiveRowRender is used', () => {
  const fakeRequestAnimationFrame = vi.fn<(callback: FrameRequestCallback) => number>()
  const fakeCancelAnimationFrame = vi.fn<(handle: number) => void>()

  beforeEach(() => {
    let fakeFrameId = 0
    fakeRequestAnimationFrame.mockImplementation((callback) => {
      const fakeCurrentId = ++fakeFrameId
      Promise.resolve().then(() => callback(0))
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
        initialRowCount: 3,
        rowChunkSize: 2,
      },
    })

    await flushPromises()

    expect(wrapper.text()).toBe('10')
  })

  it('should progressively grow visible rows when enabled', async () => {
    const wrapper = mount(TestHost, {
      props: {
        enabled: true,
        initialRowCount: 4,
        rowChunkSize: 3,
      },
    })

    await nextTick()
    expect(Number(wrapper.text())).toBeGreaterThanOrEqual(4)

    await flushPromises()
    await flushPromises()

    expect(wrapper.text()).toBe('10')
  })
})
