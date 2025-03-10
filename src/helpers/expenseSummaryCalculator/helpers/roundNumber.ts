export function roundNumber(number: number, decimalPlaces: number): number {
  return Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces
}
