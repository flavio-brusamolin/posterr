import { Document } from 'mongoose'
import { PostType } from '../../../../domain/enums/post-type'

interface RegularPostMongo extends Document {
  type: PostType
  postId: string
  userId: string
  createdAt: Date
  content: string
}

interface RepostMongo extends Document {
  type: PostType
  postId: string
  userId: string
  createdAt: Date
  originalPost: RegularPostMongo
  comment?: string
}

export type PostMongo = RegularPostMongo & RepostMongo
