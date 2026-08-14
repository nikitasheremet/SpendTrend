import { mount } from '@vue/test-utils'
import type { PopoverMethods } from '@/types/designSystem'
import Popover from '../Popover.vue'

const TestContent = {
  template: '<p>Test message</p>',
}

function mountPopover() {
  const wrapper = mount(Popover)
  return { wrapper, popover: wrapper.vm as unknown as PopoverMethods }
}

describe('Popover', () => {
  it('applies the info styling by default', async () => {
    const { wrapper, popover } = mountPopover()

    popover.showPopover(TestContent)
    await wrapper.vm.$nextTick()

    const popoverBox = wrapper.find('div')
    expect(popoverBox.classes()).toContain('bg-blue-50')
    expect(popoverBox.classes()).toContain('border-blue-300')
  })

  it('applies the info styling when explicitly requested', async () => {
    const { wrapper, popover } = mountPopover()

    popover.showPopover(TestContent, {}, { type: 'info' })
    await wrapper.vm.$nextTick()

    const popoverBox = wrapper.find('div')
    expect(popoverBox.classes()).toContain('bg-blue-50')
    expect(popoverBox.classes()).toContain('border-blue-300')
  })
})
