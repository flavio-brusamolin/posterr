import { LoadUserRepository } from '../../../../../src/application/contracts/database/user/load-user-repository'
import { UpdateUserRepository } from '../../../../../src/application/contracts/database/user/update-user-repository'
import { FollowUserService } from '../../../../../src/application/services/user/follow-user-service'
import { User } from '../../../../../src/domain/entities/user'
import { UserNotFoundError } from '../../../../../src/domain/errors'
import { generateUserInput } from '../../../../support/models'

let fakeCurrentUser: User
let fakeTargetUser: User
const setupUsers = () => {
  fakeCurrentUser = new User(generateUserInput())
  fakeTargetUser = new User(generateUserInput())
}

const makeFakeInput = () => ({
  userId: 'any_user_id',
  targetUserId: 'any_target_user_id'
})

const makeLoadUserRepository = (): LoadUserRepository => {
  class LoadUserRepositoryStub implements LoadUserRepository {
    async loadUser (userId: string): Promise<User> {
      if (userId === 'any_user_id') {
        return fakeCurrentUser
      }

      return fakeTargetUser
    }
  }

  return new LoadUserRepositoryStub()
}

const makeUpdateUserRepository = (): UpdateUserRepository => {
  class UpdateUserRepositoryStub implements UpdateUserRepository {
    async updateUser (_userId: string, _user: User): Promise<User> {
      return new User(generateUserInput())
    }
  }

  return new UpdateUserRepositoryStub()
}

interface SutTypes {
  followUserService: FollowUserService
  loadUserRepositoryStub: LoadUserRepository,
  updateUserRepositoryStub: UpdateUserRepository
}

const makeSut = (): SutTypes => {
  setupUsers()

  const loadUserRepositoryStub = makeLoadUserRepository()
  const updateUserRepositoryStub = makeUpdateUserRepository()

  const followUserService = new FollowUserService(loadUserRepositoryStub, updateUserRepositoryStub)

  return {
    followUserService,
    loadUserRepositoryStub,
    updateUserRepositoryStub
  }
}

describe('FollowUserService', () => {
  describe('#execute', () => {
    it('should call LoadUserRepository with correct values for target user', async () => {
      const { followUserService, loadUserRepositoryStub } = makeSut()
      const loadUserSpy = jest.spyOn(loadUserRepositoryStub, 'loadUser')

      const input = makeFakeInput()
      await followUserService.execute(input)

      expect(loadUserSpy).toHaveBeenCalledWith(input.targetUserId)
    })

    it('should throw a user not found error when the target user does not exist', async () => {
      const { followUserService, loadUserRepositoryStub } = makeSut()
      jest.spyOn(loadUserRepositoryStub, 'loadUser').mockResolvedValueOnce(null)

      const input = makeFakeInput()
      const promise = followUserService.execute(input)

      const error = new UserNotFoundError()
      await expect(promise).rejects.toThrow(error)
    })

    it('should call LoadUserRepository with correct values for current user', async () => {
      const { followUserService, loadUserRepositoryStub } = makeSut()
      const loadUserSpy = jest.spyOn(loadUserRepositoryStub, 'loadUser')

      const input = makeFakeInput()
      await followUserService.execute(input)

      expect(loadUserSpy).toHaveBeenCalledWith(input.userId)
    })

    it('should follow the target user', async () => {
      const { followUserService } = makeSut()
      const followSpy = jest.spyOn(User.prototype, 'follow')

      const input = makeFakeInput()
      await followUserService.execute(input)

      expect(followSpy).toHaveBeenCalledWith(fakeTargetUser)
    })

    it('should call UpdateUserRepository with correct values for both users', async () => {
      const { followUserService, updateUserRepositoryStub } = makeSut()
      const updateUserSpy = jest.spyOn(updateUserRepositoryStub, 'updateUser')

      const input = makeFakeInput()
      await followUserService.execute(input)

      expect(updateUserSpy).toHaveBeenCalledWith(fakeCurrentUser.getUserId(), fakeCurrentUser)
      expect(updateUserSpy).toHaveBeenCalledWith(fakeTargetUser.getUserId(), fakeTargetUser)
    })
  })
})
