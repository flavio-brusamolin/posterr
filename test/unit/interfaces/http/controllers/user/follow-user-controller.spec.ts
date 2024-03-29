import { UserNotFoundError } from '../../../../../../src/domain/errors'
import { FollowUserInput, FollowUserUseCase } from '../../../../../../src/domain/use-cases/user/follow-user-use-case'
import { Validator } from '../../../../../../src/interfaces/http/contracts'
import { FollowUserController } from '../../../../../../src/interfaces/http/controllers/user/follow-user-controller'
import { noContent, error } from '../../../../../../src/interfaces/http/helpers/http-response-builder'

const makeFakeRequest = () => ({
  headers: { 'user-id': 'any_user_id' },
  params: { userId: 'any_target_user_id' }
})

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (_input: any): void {
      // do nothing
    }
  }

  return new ValidatorStub()
}

const makeFollowUserUseCase = (): FollowUserUseCase => {
  class FollowUserUseCaseStub implements FollowUserUseCase {
    async execute (_input: FollowUserInput): Promise<void> {
      // do nothing
    }
  }

  return new FollowUserUseCaseStub()
}

interface SutTypes {
  followUserController: FollowUserController
  validatorStub: Validator
  followUserUseCaseStub: FollowUserUseCase
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator()
  const followUserUseCaseStub = makeFollowUserUseCase()

  const followUserController = new FollowUserController(validatorStub, followUserUseCaseStub)

  return {
    followUserController,
    validatorStub,
    followUserUseCaseStub
  }
}

describe('FollowUserController', () => {
  describe('#handle', () => {
    it('should call Validator with correct values', async () => {
      const { followUserController, validatorStub } = makeSut()
      const validateSpy = jest.spyOn(validatorStub, 'validate')

      const httpRequest = makeFakeRequest()
      await followUserController.handle(httpRequest)

      expect(validateSpy).toHaveBeenCalledWith(httpRequest)
    })

    it('should call FollowUserUseCase with correct values', async () => {
      const { followUserController, followUserUseCaseStub } = makeSut()
      const executeSpy = jest.spyOn(followUserUseCaseStub, 'execute')

      const httpRequest = makeFakeRequest()
      await followUserController.handle(httpRequest)

      const { headers, params } = httpRequest
      expect(executeSpy).toHaveBeenCalledWith({ userId: headers['user-id'], targetUserId: params.userId })
    })

    it('should return 204 on success', async () => {
      const { followUserController } = makeSut()

      const httpRequest = makeFakeRequest()
      const httpResponse = await followUserController.handle(httpRequest)

      expect(httpResponse).toEqual(noContent())
    })

    it('should log and return the error when a exception occurs', async () => {
      const { followUserController, followUserUseCaseStub } = makeSut()

      const exception = new UserNotFoundError()
      jest.spyOn(followUserUseCaseStub, 'execute').mockRejectedValueOnce(exception)

      const errorSpy = jest.spyOn(console, 'error')

      const httpRequest = makeFakeRequest()
      const httpResponse = await followUserController.handle(httpRequest)

      expect(errorSpy).toHaveBeenCalledWith(exception)
      expect(httpResponse).toEqual(error(exception))
    })
  })
})
