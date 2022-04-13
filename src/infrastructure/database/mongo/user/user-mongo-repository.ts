import UserMongoSchema from './user-mongo-schema'
import UserMongoMapper from './user-mongo-mapper'
import { User } from '../../../../domain/entities/user'
import { LoadUserRepository } from '../../../../application/contracts/load-user-repository'
import { UpdateUserRepository } from '../../../../application/contracts/update-user-repository'

export class UserMongoRepository implements LoadUserRepository, UpdateUserRepository {
  async loadUser (userId: string): Promise<User> {
    const userRecord = await UserMongoSchema.findOne({ userId })
    return userRecord && UserMongoMapper.toDomainEntity(userRecord)
  }

  async updateUser (userId: string, user: User): Promise<User> {
    const userRecord = await UserMongoSchema.findOneAndUpdate({ userId }, user, { new: true })
    return UserMongoMapper.toDomainEntity(userRecord)
  }
}
