export function splitString(
  str: string,
  separator: string = ',',
  options: {
    removeEmpty?: boolean
  } = { removeEmpty: true },
): string[] | undefined {
  const trimmedValue = str.trim()
  if (trimmedValue === '') {
    return undefined
  }
  const splitValues = trimmedValue.split(separator).map((value) => value.trim())
  if (options?.removeEmpty) {
    return splitValues.filter((value) => value.length > 0)
  }
  return splitValues
}
