export function totalReducer<T>(keyToReference: keyof T, listToReduce: T[]): number {
  const reducedNumber = listToReduce.reduce((prev: number, nextObject: T) => {
    return prev + (Number(nextObject[keyToReference] ?? 0) || 0)
  }, 0)
  return reducedNumber
}
