<script setup lang="ts">
import { ref, markRaw, type Component } from 'vue'
import type { PopoverMethods, PopoverOptions, PopoverType } from '@/types/designSystem'

const typeClassMap: Record<PopoverType, string> = {
  info: 'bg-blue-50 border border-blue-300',
}

const isVisible = ref(false)
const component = ref<Component | null>(null)
const componentProps = ref<Record<string, unknown>>({})
const type = ref<PopoverType>('info')

function hidePopover(timeout: number) {
  setTimeout(() => {
    isVisible.value = false
  }, timeout)
}

function showPopover(
  vueComponent: Component,
  props: Record<string, unknown> = {},
  options: PopoverOptions = {},
) {
  const { timeout = 1000, type: popoverType = 'info' } = options
  component.value = markRaw(vueComponent)
  componentProps.value = props
  type.value = popoverType

  isVisible.value = true
  hidePopover(timeout)
}

defineExpose<PopoverMethods>({
  showPopover,
})
</script>

<template>
  <transition
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
    enter-active-class="transition-all duration-300 ease-in-out"
    leave-active-class="transition-all duration-300 ease-in-out"
  >
    <div
      v-if="isVisible"
      :class="[
        'fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg shadow-2xl/70 p-4 z-50 shadow-stone-600',
        typeClassMap[type],
      ]"
    >
      <component :is="component" v-if="component" v-bind="componentProps" />
    </div>
  </transition>
</template>
