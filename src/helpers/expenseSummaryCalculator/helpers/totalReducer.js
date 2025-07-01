export function totalReducer(keyToReference, listToReduce) {
    const reducedNumber = listToReduce.reduce((prev, nextObject) => {
        return prev + (Number(nextObject[keyToReference] ?? 0) || 0);
    }, 0);
    return reducedNumber;
}
