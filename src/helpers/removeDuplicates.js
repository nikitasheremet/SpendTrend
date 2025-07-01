export function removeDuplicates(arrayOfValues) {
    const setWithoutDuplicates = new Set(arrayOfValues);
    return Array.from(setWithoutDuplicates.values());
}
