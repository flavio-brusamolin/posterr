import UserMongoSchema from '../../../../../src/infrastructure/database/mongo/user/user-mongo-schema'
import UserMongoMapper from '../../../../../src/infrastructure/database/mongo/user/user-mongo-mapper'
import { UserMongoRepository } from '../../../../../src/infrastructure/database/mongo/user/user-mongo-repository'
import { User } from '../../../../../src/domain/entities/user'
import { generateUserInput } from '../../../../support/models'

const fakeUserRecord = generateUserInput()
const fakeUserEntity = new User(fakeUserRecord)

jest.mock('../../../../../src/infrastructure/database/mongo/user/user-mongo-schema', () => ({
  findOne: () => fakeUserRecord,
  findOneAndUpdate: () => fakeUserRecord
}))

jest.mock('../../../../../src/infrastructure/database/mongo/user/user-mongo-mapper', () => ({
  toDomainEntity: () => fakeUserEntity
}))

describe('UserMongoRepository', () => {
  describe('#loadUser', () => {
    it('should call UserMongoSchema#findOne with correct values', async () => {
      const userMongoRepository = new UserMongoRepository()
      const findOneSpy = jest.spyOn(UserMongoSchema, 'findOne')

      const userId = 'any_user_id'
      await userMongoRepository.loadUser(userId)

      expect(findOneSpy).toHaveBeenCalledWith({ userId })
    })

    it('should call UserMongoMapper with correct values', async () => {
      const userMongoRepository = new UserMongoRepository()
      const toDomainEntitySpy = jest.spyOn(UserMongoMapper, 'toDomainEntity')

      const userId = 'any_user_id'
      await userMongoRepository.loadUser(userId)

      expect(toDomainEntitySpy).toHaveBeenCalledWith(fakeUserRecord)
    })

    it('should return the user entity', async () => {
      const userMongoRepository = new UserMongoRepository()

      const userId = 'any_user_id'
      const user = await userMongoRepository.loadUser(userId)

      expect(user).toEqual(fakeUserEntity)
    })
  })

  describe('#updateUser', () => {
    it('should call UserMongoSchema#findOneAndUpdate with correct values', async () => {
      const userMongoRepository = new UserMongoRepository()
      const findOneAndUpdateSpy = jest.spyOn(UserMongoSchema, 'findOneAndUpdate')

      const userId = 'any_user_id'
      await userMongoRepository.updateUser(userId, fakeUserEntity)

      expect(findOneAndUpdateSpy).toHaveBeenCalledWith({ userId }, fakeUserEntity, { new: true })
    })

    it('should call UserMongoMapper with correct values', async () => {
      const userMongoRepository = new UserMongoRepository()
      const toDomainEntitySpy = jest.spyOn(UserMongoMapper, 'toDomainEntity')

      const userId = 'any_user_id'
      await userMongoRepository.updateUser(userId, fakeUserEntity)

      expect(toDomainEntitySpy).toHaveBeenCalledWith(fakeUserRecord)
    })

    it('should return the user entity', async () => {
      const userMongoRepository = new UserMongoRepository()

      const userId = 'any_user_id'
      const user = await userMongoRepository.updateUser(userId, fakeUserEntity)

      expect(user).toEqual(fakeUserEntity)
    })
  })
})
