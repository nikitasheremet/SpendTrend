import { computed, defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useProgressiveRowRender } from '../useProgressiveRowRender'

const flushPromises = async () => {
  await Promise.resolve()
  await nextTick()
}

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
    const fakeData = Array.from({ length: 10 }, (_, index) => ({ id: index + 1 }))

    const wrapper = mount(
      defineComponent({
        setup() {
          const data = ref(fakeData)
          const { visibleData } = useProgressiveRowRender({
            data: computed(() => data.value),
            enabled: computed(() => false),
            initialRowCount: computed(() => 3),
            rowChunkSize: computed(() => 2),
          })

          return { visibleData }
        },
        template: '<div>{{ visibleData.length }}</div>',
      }),
    )

    await flushPromises()

    expect(wrapper.text()).toBe('10')
  })

  it('should progressively grow visible rows when enabled', async () => {
    const fakeData = Array.from({ length: 10 }, (_, index) => ({ id: index + 1 }))

    const wrapper = mount(
      defineComponent({
        setup() {
          const data = ref(fakeData)
          const { visibleData } = useProgressiveRowRender({
            data: computed(() => data.value),
            enabled: computed(() => true),
            initialRowCount: computed(() => 4),
            rowChunkSize: computed(() => 3),
          })

          return { visibleData }
        },
        template: '<div>{{ visibleData.length }}</div>',
      }),
    )

    await nextTick()
    expect(Number(wrapper.text())).toBeGreaterThanOrEqual(4)

    await flushPromises()
    await flushPromises()

    expect(wrapper.text()).toBe('10')
  })
})
