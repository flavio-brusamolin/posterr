export interface EventHandler<T = any> {
  handle: (event: T) => Promise<void>
}
