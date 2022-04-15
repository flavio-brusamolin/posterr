import { Document } from 'mongoose'
import { PostMongo } from '../post/post-mongo-entity'

export interface UserMongo extends Document {
  userId: string
  username: string
  joinedAt: Date
  followers: string[]
  following: string[]
  numberOfFollowers: number
  numberOfFollowing: number
  numberOfPosts: number
  postHistory: PostMongo[]
}
