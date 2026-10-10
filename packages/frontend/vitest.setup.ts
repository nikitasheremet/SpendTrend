import '@testing-library/jest-dom/vitest'

class ResizeObserverMock implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??= ResizeObserverMock

// jsdom does not implement scrollIntoView
Element.prototype.scrollIntoView ??= function scrollIntoView() {}
