import { Schema, model } from 'mongoose'
import { PostType } from '../../../../domain/enums/post-type'
import { PostMongo } from './post-mongo-entity'

const RegularPostSchema = {
  type: {
    type: String,
    required: true,
    enum: Object.values(PostType)
  },
  postId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  content: {
    type: String,
    required: false
  }
}

export const PostMongoSchema = new Schema({
  ...RegularPostSchema,
  originalPost: {
    type: new Schema(RegularPostSchema, { _id: false }),
    required: false
  },
  comment: {
    type: String,
    required: false
  }
})

PostMongoSchema.index({ postId: 1 }, { unique: true })
PostMongoSchema.index({ userId: 1 })

export default model<PostMongo>('posts', PostMongoSchema)
