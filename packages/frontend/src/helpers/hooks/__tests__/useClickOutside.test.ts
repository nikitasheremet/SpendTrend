import { render, screen } from '@testing-library/vue'
import { defineComponent, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useClickOutside, type UseClickOutsideOptions } from '../useClickOutside'

function createClickOutsideHarness(
  onClickOutside: () => void,
  initialIsActive: boolean,
  options?: UseClickOutsideOptions,
) {
  return defineComponent({
    setup() {
      const containerRef = ref<HTMLElement | null>(null)
      const isActive = ref(initialIsActive)

      useClickOutside(containerRef, () => isActive.value, onClickOutside, options)

      return { containerRef, isActive }
    },
    template: `<div>
      <div ref="containerRef" data-testid="container">
        <button data-testid="inside-button">inside</button>
      </div>
      <button data-testid="outside-button">outside</button>
      <div data-testid="ignored-portal" data-portal-marker>
        <button data-testid="ignored-portal-button">portal option</button>
      </div>
    </div>`,
  })
}

describe('when useClickOutside is used on a container', () => {
  it('should call the callback when clicking outside the container while active', async () => {
    const onClickOutside = vi.fn()
    render(createClickOutsideHarness(onClickOutside, true))

    screen.getByTestId('outside-button').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(onClickOutside).toHaveBeenCalledTimes(1)
  })

  it('should not call the callback when clicking inside the container while active', async () => {
    const onClickOutside = vi.fn()
    render(createClickOutsideHarness(onClickOutside, true))

    screen.getByTestId('inside-button').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(onClickOutside).not.toHaveBeenCalled()
  })

  it('should not call the callback when clicking outside while inactive', async () => {
    const onClickOutside = vi.fn()
    render(createClickOutsideHarness(onClickOutside, false))

    screen.getByTestId('outside-button').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(onClickOutside).not.toHaveBeenCalled()
  })

  it('should not call the callback after the component is unmounted', async () => {
    const onClickOutside = vi.fn()
    const { unmount } = render(createClickOutsideHarness(onClickOutside, true))
    const outsideButton = screen.getByTestId('outside-button')

    unmount()
    outsideButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(onClickOutside).not.toHaveBeenCalled()
  })

  it('should not call the callback when clicking inside an element matching ignoreSelector, even though it is outside the container', async () => {
    const onClickOutside = vi.fn()
    render(
      createClickOutsideHarness(onClickOutside, true, {
        ignoreSelector: '[data-portal-marker]',
      }),
    )

    screen
      .getByTestId('ignored-portal-button')
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(onClickOutside).not.toHaveBeenCalled()
  })

  it('should not call the callback when the clicked element is removed from the DOM by its own click handler before the event finishes bubbling', async () => {
    // Reproduces a real-browser race: a click handler on an inside element (e.g. a modal's
    // close button) can synchronously trigger a state change whose DOM update (unmounting
    // that element) flushes via a microtask checkpoint that runs *before* the same click
    // event finishes bubbling to document. By the time useClickOutside's document listener
    // runs, event.target is already detached, so a naive `container.contains(target)` check
    // (a live DOM check) wrongly reports it as outside. composedPath() must be used instead,
    // since it's captured at dispatch time and stays accurate regardless of DOM mutations that
    // happen mid-bubble. jsdom does not reproduce this exact timing on its own, so it's
    // simulated directly here by removing the element from the DOM inside its own listener.
    const onClickOutside = vi.fn()
    render(createClickOutsideHarness(onClickOutside, true))

    const insideButton = screen.getByTestId('inside-button')
    insideButton.addEventListener('click', () => insideButton.remove())
    insideButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(onClickOutside).not.toHaveBeenCalled()
  })
})
