export type PartialDeep<T> = T extends object ? {
  [K in keyof T]?: PartialDeep<T[K]>
} : T

export type Nullable<T> = T extends object ? {
  [K in keyof T]: T[K] | null
} : T | null
