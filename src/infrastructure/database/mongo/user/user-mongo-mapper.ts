import { UserMongo } from './user-mongo-entity'
import { User } from '../../../../domain/entities/user'
import PostMongoMapper from '../post/post-mongo-mapper'

export default {
  toDomainEntity: ({ userId, username, joinedAt, followers, following, numberOfFollowers, numberOfFollowing, numberOfPosts, postHistory }: UserMongo): User => {
    return new User({
      userId,
      username,
      joinedAt,
      followers,
      following,
      numberOfFollowers,
      numberOfFollowing,
      numberOfPosts,
      postHistory: postHistory.map(PostMongoMapper.toDomainEntity)
    })
  }
}
