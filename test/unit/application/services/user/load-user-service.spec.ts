import { LoadUserRepository } from '../../../../../src/application/contracts/database/user/load-user-repository'
import { LoadUserService } from '../../../../../src/application/services/user/load-user-service'
import { User } from '../../../../../src/domain/entities/user'
import { UserNotFoundError } from '../../../../../src/domain/errors'
import { generateUserInput } from '../../../../support/models'

const fakeUser = new User(generateUserInput())

const makeFakeInput = () => ({
  userId: 'any_user_id',
  targetUserId: 'any_target_user_id'
})

const makeLoadUserRepository = (): LoadUserRepository => {
  class LoadUserRepositoryStub implements LoadUserRepository {
    async loadUser (_userId: string): Promise<User> {
      return fakeUser
    }
  }

  return new LoadUserRepositoryStub()
}

interface SutTypes {
  loadUserService: LoadUserService
  loadUserRepositoryStub: LoadUserRepository
}

const makeSut = (): SutTypes => {
  const loadUserRepositoryStub = makeLoadUserRepository()

  const loadUserService = new LoadUserService(loadUserRepositoryStub)

  return {
    loadUserService,
    loadUserRepositoryStub
  }
}

describe('LoadUserService', () => {
  describe('#execute', () => {
    it('should call LoadUserRepository with correct values', async () => {
      const { loadUserService, loadUserRepositoryStub } = makeSut()
      const loadUserSpy = jest.spyOn(loadUserRepositoryStub, 'loadUser')

      const input = makeFakeInput()
      await loadUserService.execute(input)

      expect(loadUserSpy).toHaveBeenCalledWith(input.targetUserId)
    })

    it('should throw a user not found error when the user does not exist', async () => {
      const { loadUserService, loadUserRepositoryStub } = makeSut()
      jest.spyOn(loadUserRepositoryStub, 'loadUser').mockResolvedValueOnce(null)

      const input = makeFakeInput()
      const promise = loadUserService.execute(input)

      const error = new UserNotFoundError()
      await expect(promise).rejects.toThrow(error)
    })

    it('should return the retrieved and serialized user', async () => {
      const { loadUserService } = makeSut()

      const input = makeFakeInput()
      const user = await loadUserService.execute(input)

      expect(user).toEqual({
        ...fakeUser,
        followingNow: fakeUser.isFollowedBy(input.userId)
      })
    })
  })
})
