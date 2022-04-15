import { PostType } from '../enums/post-type'
import { MaxLengthError } from '../errors'

interface RegularPostInput {
  type?: PostType
  postId: string
  userId: string
  createdAt?: Date
  content: string
}

export class RegularPost {
  private type: PostType
  private postId: string
  private userId: string
  private createdAt: Date
  private content: string

  constructor ({ type, postId, userId, createdAt, content }: RegularPostInput) {
    this.setType(type)
    this.setPostId(postId)
    this.setUserId(userId)
    this.setCreatedAt(createdAt)
    this.setContent(content)
  }

  private setType (type?: PostType): void {
    this.type = type ?? PostType.REGULAR_POST
  }

  private setPostId (postId: string): void {
    this.postId = postId
  }

  private setUserId (userId: string): void {
    this.userId = userId
  }

  private setCreatedAt (createdAt?: Date): void {
    this.createdAt = createdAt ?? new Date()
  }

  private setContent (content: string): void {
    const MAX_LENGTH = 777
    if (content.length > MAX_LENGTH) {
      throw new MaxLengthError('content', MAX_LENGTH)
    }

    this.content = content
  }

  getUserId (): string {
    return this.userId
  }
}
