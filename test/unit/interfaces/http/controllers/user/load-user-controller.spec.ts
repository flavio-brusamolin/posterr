import { User } from '../../../../../../src/domain/entities/user'
import { UserNotFoundError } from '../../../../../../src/domain/errors'
import { LoadUserInput, LoadUserUseCase, SerializedUser } from '../../../../../../src/domain/use-cases/user/load-user-use-case'
import { LoadUserController } from '../../../../../../src/interfaces/http/controllers/user/load-user-controller'
import { error, ok } from '../../../../../../src/interfaces/http/helpers/http-response-builder'
import { generateUserInput } from '../../../../../support/models'

const fakeUser = { ...new User(generateUserInput()), followingNow: true }

const makeFakeRequest = () => ({
  headers: { 'user-id': 'any_user_id' },
  params: { userId: 'any_target_user_id' }
})

const makeLoadUserUseCase = (): LoadUserUseCase => {
  class LoadUserUseCaseStub implements LoadUserUseCase {
    async execute (_input: LoadUserInput): Promise<SerializedUser> {
      return fakeUser
    }
  }

  return new LoadUserUseCaseStub()
}

interface SutTypes {
  loadUserController: LoadUserController
  loadUserUseCaseStub: LoadUserUseCase
}

const makeSut = (): SutTypes => {
  const loadUserUseCaseStub = makeLoadUserUseCase()

  const loadUserController = new LoadUserController(loadUserUseCaseStub)

  return {
    loadUserController,
    loadUserUseCaseStub
  }
}

describe('LoadUserController', () => {
  describe('#handle', () => {
    it('should call LoadUserUseCase with correct values', async () => {
      const { loadUserController, loadUserUseCaseStub } = makeSut()
      const executeSpy = jest.spyOn(loadUserUseCaseStub, 'execute')

      const httpRequest = makeFakeRequest()
      await loadUserController.handle(httpRequest)

      const { headers, params } = httpRequest
      expect(executeSpy).toHaveBeenCalledWith({ userId: headers['user-id'], targetUserId: params.userId })
    })

    it('should return 200 and the retrieved user on success', async () => {
      const { loadUserController } = makeSut()

      const httpRequest = makeFakeRequest()
      const httpResponse = await loadUserController.handle(httpRequest)

      expect(httpResponse).toEqual(ok(fakeUser))
    })

    it('should log and return the error when a exception occurs', async () => {
      const { loadUserController, loadUserUseCaseStub } = makeSut()

      const exception = new UserNotFoundError()
      jest.spyOn(loadUserUseCaseStub, 'execute').mockRejectedValueOnce(exception)

      const errorSpy = jest.spyOn(console, 'error')

      const httpRequest = makeFakeRequest()
      const httpResponse = await loadUserController.handle(httpRequest)

      expect(errorSpy).toHaveBeenCalledWith(exception)
      expect(httpResponse).toEqual(error(exception))
    })
  })
})
