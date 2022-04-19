import PostMongoSchema from './post-mongo-schema'
import PostMongoMapper from './post-mongo-mapper'
import { CountTodayPostsRepository } from '../../../../application/contracts/database/post/count-today-posts-repository'
import { CreateRegularPostRepository } from '../../../../application/contracts/database/post/create-regular-post-repository'
import { CreateRepostRepository } from '../../../../application/contracts/database/post/create-repost-repository'
import { LoadPostRepository } from '../../../../application/contracts/database/post/load-post-repository'
import { LoadPostsRepository } from '../../../../application/contracts/database/post/load-posts-repository'
import { Post } from '../../../../domain/aggregates/post'
import { RegularPost } from '../../../../domain/entities/regular-post'
import { Repost } from '../../../../domain/entities/repost'

export class PostMongoRepository implements CreateRegularPostRepository, CreateRepostRepository, CountTodayPostsRepository, LoadPostRepository, LoadPostsRepository {
  async createRegularPost (regularPost: RegularPost): Promise<RegularPost> {
    const regularPostRecord = await PostMongoSchema.create(regularPost)
    const regularPostResponse = PostMongoMapper.toDomainEntity(regularPostRecord)
    return (regularPostResponse instanceof RegularPost) && regularPostResponse
  }

  async createRepost (repost: Repost): Promise<Repost> {
    const repostRecord = await PostMongoSchema.create(repost)
    const repostResponse = PostMongoMapper.toDomainEntity(repostRecord)
    return (repostResponse instanceof Repost) && repostResponse
  }

  async loadPost (postId: string): Promise<Post> {
    const postRecord = await PostMongoSchema.findOne({ postId })
    return postRecord && PostMongoMapper.toDomainEntity(postRecord)
  }

  async loadPosts (userIds?: string[]): Promise<Post[]> {
    const query = userIds ? { userId: { $in: userIds } } : {}
    const postRecords = await PostMongoSchema.find(query).sort('-createdAt')
    return postRecords.map(PostMongoMapper.toDomainEntity)
  }

  async countTodayPosts (userId: string): Promise<number> {
    const startOfDay = this.getStartOfDay()
    const numberOfPosts = await PostMongoSchema.countDocuments({
      userId,
      createdAt: { $gte: startOfDay }
    })
    return numberOfPosts
  }

  private getStartOfDay (): Date {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return startOfDay
  }
}
