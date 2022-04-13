import { UserMongo } from './user-mongo-entity'
import { User } from '../../../../domain/entities/user'

export default {
  toDomainEntity: ({ userId, username, joinedAt, followers, following, numberOfFollowers, numberOfFollowing, numberOfPosts }: UserMongo): User => {
    return new User({
      userId,
      username,
      joinedAt,
      followers,
      following,
      numberOfFollowers,
      numberOfFollowing,
      numberOfPosts
    })
  }
}
