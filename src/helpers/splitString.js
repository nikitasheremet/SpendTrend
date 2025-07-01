export function splitString(str, separator = ',', options = { removeEmpty: true }) {
    const trimmedValue = str.trim();
    if (trimmedValue === '') {
        return undefined;
    }
    const splitValues = trimmedValue.split(separator).map((value) => value.trim());
    if (options?.removeEmpty) {
        return splitValues.filter((value) => value.length > 0);
    }
    return splitValues;
}
