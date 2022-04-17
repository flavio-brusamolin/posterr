import { LoadUserRepository } from '../../../../src/application/contracts/database/user/load-user-repository'
import { UpdateUserRepository } from '../../../../src/application/contracts/database/user/update-user-repository'
import { UpdateUserWhenPostCreatedHandler } from '../../../../src/application/event-handlers/update-user-when-post-created-handler'
import { RegularPost } from '../../../../src/domain/entities/regular-post'
import { User } from '../../../../src/domain/entities/user'
import { generateRegularPostInput, generateUserInput } from '../../../support/models'

const fakeUser = new User(generateUserInput())

const makeFakeInput = () => ({
  dateTimeOccurred: new Date(),
  data: new RegularPost(generateRegularPostInput())
})

const makeLoadUserRepository = (): LoadUserRepository => {
  class LoadUserRepositoryStub implements LoadUserRepository {
    async loadUser (_userId: string): Promise<User> {
      return fakeUser
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
  updateUserWhenPostCreatedHandler: UpdateUserWhenPostCreatedHandler
  loadUserRepositoryStub: LoadUserRepository
  updateUserRepositoryStub: UpdateUserRepository
}

const makeSut = (): SutTypes => {
  const loadUserRepositoryStub = makeLoadUserRepository()
  const updateUserRepositoryStub = makeUpdateUserRepository()

  const updateUserWhenPostCreatedHandler = new UpdateUserWhenPostCreatedHandler(loadUserRepositoryStub, updateUserRepositoryStub)

  return {
    updateUserWhenPostCreatedHandler,
    loadUserRepositoryStub,
    updateUserRepositoryStub
  }
}

describe('UpdateUserWhenPostCreatedHandler', () => {
  describe('#handle', () => {
    it('should call LoadUserRepository with correct values', async () => {
      const { updateUserWhenPostCreatedHandler, loadUserRepositoryStub } = makeSut()
      const loadUserSpy = jest.spyOn(loadUserRepositoryStub, 'loadUser')

      const event = makeFakeInput()
      await updateUserWhenPostCreatedHandler.handle(event)

      const { data: post } = event
      expect(loadUserSpy).toHaveBeenCalledWith(post.getUserId())
    })

    it('should update the user\'s post history', async () => {
      const { updateUserWhenPostCreatedHandler } = makeSut()
      const updatePostHistorySpy = jest.spyOn(User.prototype, 'updatePostHistory')

      const event = makeFakeInput()
      await updateUserWhenPostCreatedHandler.handle(event)

      const { data: post } = event
      expect(updatePostHistorySpy).toHaveBeenCalledWith(post)
    })

    it('should call UpdateUserRepository with correct values', async () => {
      const { updateUserWhenPostCreatedHandler, updateUserRepositoryStub } = makeSut()
      const updateUserSpy = jest.spyOn(updateUserRepositoryStub, 'updateUser')

      const event = makeFakeInput()
      await updateUserWhenPostCreatedHandler.handle(event)

      expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.getUserId(), fakeUser)
    })

    it('should log and not throw the error when a error occurs', async () => {
      const { updateUserWhenPostCreatedHandler, updateUserRepositoryStub } = makeSut()

      const exception = new Error('any_error')
      jest.spyOn(updateUserRepositoryStub, 'updateUser').mockRejectedValueOnce(exception)

      const errorSpy = jest.spyOn(console, 'error')

      const event = makeFakeInput()
      const respose = await updateUserWhenPostCreatedHandler.handle(event)

      expect(respose).toBeUndefined()
      expect(errorSpy).toHaveBeenCalledWith(exception)
    })
  })
})
