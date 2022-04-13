import { Document } from 'mongoose'

export interface UserMongo extends Document {
  userId: string
  username: string
  joinedAt: Date
  followers: string[]
  following: string[]
  numberOfFollowers: number
  numberOfFollowing: number
  numberOfPosts: number
}
