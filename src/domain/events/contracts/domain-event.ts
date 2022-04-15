export interface DomainEvent<T = any> {
  dateTimeOccurred: Date
  data: T
}
