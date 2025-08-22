// Utility type:
// - removes the given fields from T
// - makes all remaining fields optional except for K
export type OmitAndMakeOptionalExceptForSome<
  T,
  K extends keyof T,
  Remove extends keyof T = never,
> = {
  [P in K]: T[P]
} & Partial<Omit<T, K | Remove>>
