export function removeDuplicates<T>(arrayOfValues: T[]): T[] {
  const setWithoutDuplicates = new Set(arrayOfValues)
  return Array.from(setWithoutDuplicates.values())
}
