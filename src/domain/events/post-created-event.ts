import { DomainEvent } from './contracts/domain-event'
import { Post } from '../aggregates/post'

export class PostCreatedEvent implements DomainEvent<Post> {
  dateTimeOccurred: Date
  data: Post

  constructor (post: Post) {
    this.dateTimeOccurred = new Date()
    this.data = post
  }
}
