export const excludeFieldsAndAdd = <
  T extends Record<string, unknown>,
  K extends keyof T,
  A extends Record<string, unknown> = Record<string, never>,
>(
  obj: T,
  excludeKeys: K[],
  additions: A = {} as A,
): Omit<T, K> & A => {
  const rest = Object.fromEntries(
    Object.entries(obj).filter(([key]) => !excludeKeys.includes(key as K)),
  ) as Omit<T, K>
  return { ...rest, ...additions }
}
