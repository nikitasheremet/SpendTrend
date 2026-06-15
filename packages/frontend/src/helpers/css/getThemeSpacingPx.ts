const PX_UNIT_REGEX = /px$/
const FALLBACK_PX = 0

export function getThemeSpacingPx(tokenName: string): number {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--spacing-${tokenName}`)
    .trim()

  if (!PX_UNIT_REGEX.test(value)) {
    return FALLBACK_PX
  }

  return Number.parseFloat(value)
}
