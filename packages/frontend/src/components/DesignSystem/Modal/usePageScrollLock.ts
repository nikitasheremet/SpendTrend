import { toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

// Shared across every modal so stacked modals keep the page locked until the
// last one closes.
let activeLockCount = 0
let previousOverflow = ''
let previousScrollbarGutter = ''

/**
 * Stops the page behind from scrolling while `isLocked` is true, so wheel and
 * touch scrolling over a modal never move the page underneath it.
 */
export function usePageScrollLock(isLocked: MaybeRefOrGetter<boolean>) {
  watchEffect((onCleanup) => {
    if (!toValue(isLocked)) return
    lockPageScroll()
    onCleanup(unlockPageScroll)
  })
}

function lockPageScroll() {
  activeLockCount += 1
  if (activeLockCount > 1) return

  const rootStyle = document.documentElement.style
  previousOverflow = rootStyle.overflow
  previousScrollbarGutter = rootStyle.scrollbarGutter
  rootStyle.overflow = 'hidden'
  // Keep the space the scrollbar took so the page doesn't shift sideways.
  rootStyle.scrollbarGutter = 'stable'
}

function unlockPageScroll() {
  activeLockCount -= 1
  if (activeLockCount > 0) return

  const rootStyle = document.documentElement.style
  rootStyle.overflow = previousOverflow
  rootStyle.scrollbarGutter = previousScrollbarGutter
}
