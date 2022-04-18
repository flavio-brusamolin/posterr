import { Post } from '../../../../../../src/domain/aggregates/post'
import { RegularPost } from '../../../../../../src/domain/entities/regular-post'
import { ErrorType } from '../../../../../../src/domain/enums/error-type'
import { FromOption } from '../../../../../../src/domain/enums/from-option'
import { CustomError } from '../../../../../../src/domain/errors/custom/custom-error'
import { LoadPostsInput, LoadPostsUseCase } from '../../../../../../src/domain/use-cases/post/load-posts-use-case'
import { Validator } from '../../../../../../src/interfaces/http/contracts'
import { LoadPostsController } from '../../../../../../src/interfaces/http/controllers/post/load-posts-controller'
import { error, ok } from '../../../../../../src/interfaces/http/helpers/http-response-builder'
import { generateRegularPostInput } from '../../../../../support/models'

const fakeRegularPost = new RegularPost(generateRegularPostInput())

const makeFakeRequest = () => ({
  headers: { 'user-id': 'any_user_id' },
  query: { from: FromOption.ALL }
})

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (_input: any): void {
      // do nothing
    }
  }

  return new ValidatorStub()
}

const makeLoadPostsUseCase = (): LoadPostsUseCase => {
  class LoadPostsUseCaseStub implements LoadPostsUseCase {
    async execute (_input: LoadPostsInput): Promise<Post[]> {
      return [fakeRegularPost]
    }
  }

  return new LoadPostsUseCaseStub()
}

interface SutTypes {
  loadPostsController: LoadPostsController
  validatorStub: Validator
  loadPostsUseCaseStub: LoadPostsUseCase
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator()
  const loadPostsUseCaseStub = makeLoadPostsUseCase()

  const loadPostsController = new LoadPostsController(validatorStub, loadPostsUseCaseStub)

  return {
    loadPostsController,
    validatorStub,
    loadPostsUseCaseStub
  }
}

describe('LoadPostsController', () => {
  describe('#handle', () => {
    it('should call Validator with correct values', async () => {
      const { loadPostsController, validatorStub } = makeSut()
      const validateSpy = jest.spyOn(validatorStub, 'validate')

      const httpRequest = makeFakeRequest()
      await loadPostsController.handle(httpRequest)

      expect(validateSpy).toHaveBeenCalledWith(httpRequest)
    })

    it('should call LoadPostsUseCase with correct values', async () => {
      const { loadPostsController, loadPostsUseCaseStub } = makeSut()
      const executeSpy = jest.spyOn(loadPostsUseCaseStub, 'execute')

      const httpRequest = makeFakeRequest()
      await loadPostsController.handle(httpRequest)

      const { headers, query } = httpRequest
      expect(executeSpy).toHaveBeenCalledWith({ userId: headers['user-id'], from: query.from })
    })

    it('should return 200 and the retrieved posts on success', async () => {
      const { loadPostsController } = makeSut()

      const httpRequest = makeFakeRequest()
      const httpResponse = await loadPostsController.handle(httpRequest)

      expect(httpResponse).toEqual(ok([fakeRegularPost]))
    })

    it('should log and return the error when a exception occurs', async () => {
      const { loadPostsController, loadPostsUseCaseStub } = makeSut()

      const exception = new CustomError()
      exception.type = ErrorType.INTERNAL
      jest.spyOn(loadPostsUseCaseStub, 'execute').mockRejectedValueOnce(exception)

      const errorSpy = jest.spyOn(console, 'error')

      const httpRequest = makeFakeRequest()
      const httpResponse = await loadPostsController.handle(httpRequest)

      expect(errorSpy).toHaveBeenCalledWith(exception)
      expect(httpResponse).toEqual(error(exception))
    })
  })
})
