type ClassDataKeys<T> = {
  [K in keyof T]:
  T[K] extends (...args: any[]) => any ? never : K
}[keyof T]

export type ClassData<T> = Pick<T, ClassDataKeys<T>>
