import type { Component, Ref } from 'vue'

export interface PopoverOptions {
  timeout?: number
}

export interface PopoverMethods {
  showPopover: (
    vueComponent: Component,
    props?: Record<string, unknown>,
    options?: PopoverOptions,
  ) => void
}

export type PopoverRef = Ref<PopoverMethods | undefined>
