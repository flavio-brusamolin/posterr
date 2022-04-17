import { LoadUserRepository } from '../../../../../src/application/contracts/database/user/load-user-repository'
import { UpdateUserRepository } from '../../../../../src/application/contracts/database/user/update-user-repository'
import { UnfollowUserService } from '../../../../../src/application/services/user/unfollow-user-service'
import { User } from '../../../../../src/domain/entities/user'
import { UserNotFoundError } from '../../../../../src/domain/errors'
import { generateUserInput } from '../../../../support/models'

let fakeCurrentUser: User
let fakeTargetUser: User
const setupUsers = () => {
  fakeCurrentUser = new User(generateUserInput())
  fakeTargetUser = new User(generateUserInput())
  fakeCurrentUser.follow(fakeTargetUser)
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
  unfollowUserService: UnfollowUserService
  loadUserRepositoryStub: LoadUserRepository
  updateUserRepositoryStub: UpdateUserRepository
}

const makeSut = (): SutTypes => {
  setupUsers()

  const loadUserRepositoryStub = makeLoadUserRepository()
  const updateUserRepositoryStub = makeUpdateUserRepository()

  const unfollowUserService = new UnfollowUserService(loadUserRepositoryStub, updateUserRepositoryStub)

  return {
    unfollowUserService,
    loadUserRepositoryStub,
    updateUserRepositoryStub
  }
}

describe('UnfollowUserService', () => {
  describe('#execute', () => {
    it('should call LoadUserRepository with correct values for target user', async () => {
      const { unfollowUserService, loadUserRepositoryStub } = makeSut()
      const loadUserSpy = jest.spyOn(loadUserRepositoryStub, 'loadUser')

      const input = makeFakeInput()
      await unfollowUserService.execute(input)

      expect(loadUserSpy).toHaveBeenCalledWith(input.targetUserId)
    })

    it('should throw a user not found error when the target user does not exist', async () => {
      const { unfollowUserService, loadUserRepositoryStub } = makeSut()
      jest.spyOn(loadUserRepositoryStub, 'loadUser').mockResolvedValueOnce(null)

      const input = makeFakeInput()
      const promise = unfollowUserService.execute(input)

      const error = new UserNotFoundError()
      await expect(promise).rejects.toThrow(error)
    })

    it('should call LoadUserRepository with correct values for current user', async () => {
      const { unfollowUserService, loadUserRepositoryStub } = makeSut()
      const loadUserSpy = jest.spyOn(loadUserRepositoryStub, 'loadUser')

      const input = makeFakeInput()
      await unfollowUserService.execute(input)

      expect(loadUserSpy).toHaveBeenCalledWith(input.userId)
    })

    it('should unfollow the target user', async () => {
      const { unfollowUserService } = makeSut()
      const unfollowSpy = jest.spyOn(User.prototype, 'unfollow')

      const input = makeFakeInput()
      await unfollowUserService.execute(input)

      expect(unfollowSpy).toHaveBeenCalledWith(fakeTargetUser)
    })

    it('should call UpdateUserRepository with correct values for both users', async () => {
      const { unfollowUserService, updateUserRepositoryStub } = makeSut()
      const updateUserSpy = jest.spyOn(updateUserRepositoryStub, 'updateUser')

      const input = makeFakeInput()
      await unfollowUserService.execute(input)

      expect(updateUserSpy).toHaveBeenCalledWith(fakeCurrentUser.getUserId(), fakeCurrentUser)
      expect(updateUserSpy).toHaveBeenCalledWith(fakeTargetUser.getUserId(), fakeTargetUser)
    })
  })
})
