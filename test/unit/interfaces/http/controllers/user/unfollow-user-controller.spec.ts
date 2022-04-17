import { UserNotFoundError } from '../../../../../../src/domain/errors'
import { UnfollowUserInput, UnfollowUserUseCase } from '../../../../../../src/domain/use-cases/user/unfollow-user-use-case'
import { UnfollowUserController } from '../../../../../../src/interfaces/http/controllers/user/unfollow-user-controller'
import { noContent, error } from '../../../../../../src/interfaces/http/helpers/http-response-builder'

const makeFakeRequest = () => ({
  headers: { 'user-id': 'any_user_id' },
  params: { userId: 'any_target_user_id' }
})

const makeUnfollowUserUseCase = (): UnfollowUserUseCase => {
  class UnfollowUserUseCaseStub implements UnfollowUserUseCase {
    async execute (_input: UnfollowUserInput): Promise<void> {
      // do nothing
    }
  }

  return new UnfollowUserUseCaseStub()
}

interface SutTypes {
  unfollowUserController: UnfollowUserController
  unfollowUserUseCaseStub: UnfollowUserUseCase
}

const makeSut = (): SutTypes => {
  const unfollowUserUseCaseStub = makeUnfollowUserUseCase()

  const unfollowUserController = new UnfollowUserController(unfollowUserUseCaseStub)

  return {
    unfollowUserController,
    unfollowUserUseCaseStub
  }
}

describe('UnfollowUserController', () => {
  describe('#handle', () => {
    it('should call UnfollowUserUseCase with correct values', async () => {
      const { unfollowUserController, unfollowUserUseCaseStub } = makeSut()
      const executeSpy = jest.spyOn(unfollowUserUseCaseStub, 'execute')

      const httpRequest = makeFakeRequest()
      await unfollowUserController.handle(httpRequest)

      const { headers, params } = httpRequest
      expect(executeSpy).toHaveBeenCalledWith({ userId: headers['user-id'], targetUserId: params.userId })
    })

    it('should return 204 on success', async () => {
      const { unfollowUserController } = makeSut()

      const httpRequest = makeFakeRequest()
      const httpResponse = await unfollowUserController.handle(httpRequest)

      expect(httpResponse).toEqual(noContent())
    })

    it('should log and return the error when a exception occurs', async () => {
      const { unfollowUserController, unfollowUserUseCaseStub } = makeSut()

      const exception = new UserNotFoundError()
      jest.spyOn(unfollowUserUseCaseStub, 'execute').mockRejectedValueOnce(exception)

      const errorSpy = jest.spyOn(console, 'error')

      const httpRequest = makeFakeRequest()
      const httpResponse = await unfollowUserController.handle(httpRequest)

      expect(errorSpy).toHaveBeenCalledWith(exception)
      expect(httpResponse).toEqual(error(exception))
    })
  })
})
