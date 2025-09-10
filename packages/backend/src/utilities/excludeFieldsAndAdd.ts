export const excludeFieldsAndAdd = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  excludeKeys: K[],
  additions: Record<string, any> = {},
): Omit<T, K> & Record<string, any> => {
  const rest = Object.fromEntries(
    Object.entries(obj).filter(([key]) => !excludeKeys.includes(key as K)),
  ) as Omit<T, K>
  return { ...rest, ...additions }
}
