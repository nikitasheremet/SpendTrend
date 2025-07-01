export function roundNumber(number, decimalPlaces) {
    return Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}
