import { RegularPost } from './regular-post'
import { PostType } from '../enums/post-type'

interface RepostInput {
  type?: PostType
  postId: string
  userId: string
  createdAt?: Date
  originalPost: RegularPost
  comment?: string
}

export class Repost {
  private type: PostType
  private postId: string
  private userId: string
  private createdAt: Date
  private originalPost: RegularPost
  private comment?: string

  constructor ({ type, postId, userId, createdAt, originalPost, comment }: RepostInput) {
    this.setType(type)
    this.setPostId(postId)
    this.setUserId(userId)
    this.setCreatedAt(createdAt)
    this.setOriginalPost(originalPost)
    this.setComment(comment)
  }

  private setType (type?: PostType): void {
    this.type = type ?? PostType.REPOST
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

  private setOriginalPost (originalPost: RegularPost): void {
    this.originalPost = originalPost
  }

  private setComment (comment?: string): void {
    this.comment = comment
  }

  getUserId (): string {
    return this.userId
  }
}
