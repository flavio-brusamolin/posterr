import { Schema, model } from 'mongoose'
import { UserMongo } from './user-mongo-entity'

const UserMongoSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  joinedAt: {
    type: Date,
    required: true
  },
  followers: {
    type: [String],
    required: true
  },
  following: {
    type: [String],
    required: true
  },
  numberOfFollowers: {
    type: Number,
    required: true
  },
  numberOfFollowing: {
    type: Number,
    required: true
  },
  numberOfPosts: {
    type: Number,
    required: true
  }
})

UserMongoSchema.index({ userId: 1 }, { unique: true })

export default model<UserMongo>('users', UserMongoSchema)
