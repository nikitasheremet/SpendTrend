import { onMounted, onUnmounted, type Ref } from 'vue'

export interface UseClickOutsideOptions {
  /**
   * Clicks landing inside an element matching this selector are treated as
   * "inside" even if they aren't a DOM descendant of containerRef. Needed for
   * content that is teleported elsewhere in the DOM (e.g. `<Teleport to="body">`)
   * but is logically part of the container.
   */
  ignoreSelector?: string
}

/**
 * Invokes `onClickOutside` when a `click` lands outside `containerRef`, while
 * `isActive()` returns true. A single `document`-level listener is registered
 * on mount and removed on unmount; it stays registered for the component's
 * whole lifetime and is gated by `isActive()` on every click rather than
 * being added/removed as the container opens and closes, so this is safe to
 * use on elements that stay mounted (e.g. `v-show` panels) as well as ones
 * that are conditionally rendered (`v-if`).
 *
 * Listens on `click` rather than `mousedown` deliberately: if the same click
 * both opens/closes the container via another handler (e.g. a toggle button
 * outside the container) and would also be seen by this listener, using
 * `click` guarantees the toggle handler on the closer target runs first
 * during the bubble phase, so `isActive()` already reflects the new state by
 * the time this listener runs — avoiding a close-then-reopen flicker that
 * `mousedown` (a separate, earlier event) would cause.
 *
 * Pass `ignoreSelector` when the container has logical children that live
 * elsewhere in the DOM via `<Teleport>` — e.g. a dropdown or modal rendered
 * to `<body>`. Such elements aren't real DOM descendants of `containerRef`,
 * so `containerRef.value.contains(event.target)` returns false for them even
 * though a click on them shouldn't count as "outside." Mark the teleported
 * root with an attribute (e.g. `data-my-thing-portal`) and pass a matching
 * selector (e.g. `'[data-my-thing-portal]'`) to have clicks inside it ignored.
 *
 * @param containerRef - Ref to the element clicks are checked against; a click is "outside" if it (or its DOM ancestor chain) isn't this element or one of its descendants.
 * @param isActive - Called on every click; the click is ignored entirely when this returns false (e.g. pass `() => isOpen` so closed/unmounted-in-spirit containers don't react to clicks).
 * @param onClickOutside - Called once per outside click, e.g. `() => emit('close')`.
 * @param options.ignoreSelector - CSS selector; clicks landing inside a matching element are treated as "inside" even though they aren't DOM descendants of `containerRef` (for `<Teleport>`-rendered content).
 */
export function useClickOutside(
  containerRef: Ref<HTMLElement | null | undefined>,
  isActive: () => boolean,
  onClickOutside: () => void,
  options?: UseClickOutsideOptions,
) {
  function handleClick(event: MouseEvent) {
    if (!isActive()) return
    const container = containerRef.value
    if (!container) return
    const target = event.target as Node
    if (container.contains(target)) return
    if (options?.ignoreSelector && (target as HTMLElement).closest?.(options.ignoreSelector)) return
    onClickOutside()
  }

  onMounted(() => document.addEventListener('click', handleClick))
  onUnmounted(() => document.removeEventListener('click', handleClick))
}
