export function cleanNumber(value: string | undefined): number | undefined {
  if (value === undefined) return undefined
  const cleanedValue = parseFloat(value.replace('$', '').replace(',', '').replace('−', '-'))
  const isNumber = Boolean(cleanedValue) && !isNaN(cleanedValue)
  if (isNumber) {
    return Math.abs(cleanedValue)
  }
  return undefined
}
