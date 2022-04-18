import { RegularPost } from '../../../../../../src/domain/entities/regular-post'
import { PostLimitError } from '../../../../../../src/domain/errors'
import { CreateRegularPostInput, CreateRegularPostUseCase } from '../../../../../../src/domain/use-cases/post/create-regular-post-use-case'
import { Validator } from '../../../../../../src/interfaces/http/contracts'
import { CreateRegularPostController } from '../../../../../../src/interfaces/http/controllers/post/create-regular-post-controller'
import { created, error } from '../../../../../../src/interfaces/http/helpers/http-response-builder'
import { generateRegularPostInput } from '../../../../../support/models'

const fakeRegularPost = new RegularPost(generateRegularPostInput())

const makeFakeRequest = () => ({
  headers: { 'user-id': 'any_user_id' },
  body: { content: 'any_content' }
})

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (_input: any): void {
      // do nothing
    }
  }

  return new ValidatorStub()
}

const makeCreateRegularPostUseCase = (): CreateRegularPostUseCase => {
  class CreateRegularPostUseCaseStub implements CreateRegularPostUseCase {
    async execute (_input: CreateRegularPostInput): Promise<RegularPost> {
      return fakeRegularPost
    }
  }

  return new CreateRegularPostUseCaseStub()
}

interface SutTypes {
  createRegularPostController: CreateRegularPostController
  validatorStub: Validator
  createRegularPostUseCaseStub: CreateRegularPostUseCase
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator()
  const createRegularPostUseCaseStub = makeCreateRegularPostUseCase()

  const createRegularPostController = new CreateRegularPostController(validatorStub, createRegularPostUseCaseStub)

  return {
    createRegularPostController,
    validatorStub,
    createRegularPostUseCaseStub
  }
}

describe('CreateRegularPostController', () => {
  describe('#handle', () => {
    it('should call Validator with correct values', async () => {
      const { createRegularPostController, validatorStub } = makeSut()
      const validateSpy = jest.spyOn(validatorStub, 'validate')

      const httpRequest = makeFakeRequest()
      await createRegularPostController.handle(httpRequest)

      expect(validateSpy).toHaveBeenCalledWith(httpRequest)
    })

    it('should call CreateRegularPostUseCase with correct values', async () => {
      const { createRegularPostController, createRegularPostUseCaseStub } = makeSut()
      const executeSpy = jest.spyOn(createRegularPostUseCaseStub, 'execute')

      const httpRequest = makeFakeRequest()
      await createRegularPostController.handle(httpRequest)

      const { headers, body } = httpRequest
      expect(executeSpy).toHaveBeenCalledWith({ userId: headers['user-id'], content: body.content })
    })

    it('should return 201 and the created regular post on success', async () => {
      const { createRegularPostController } = makeSut()

      const httpRequest = makeFakeRequest()
      const httpResponse = await createRegularPostController.handle(httpRequest)

      expect(httpResponse).toEqual(created(fakeRegularPost))
    })

    it('should log and return the error when a exception occurs', async () => {
      const { createRegularPostController, createRegularPostUseCaseStub } = makeSut()

      const exception = new PostLimitError()
      jest.spyOn(createRegularPostUseCaseStub, 'execute').mockRejectedValueOnce(exception)

      const errorSpy = jest.spyOn(console, 'error')

      const httpRequest = makeFakeRequest()
      const httpResponse = await createRegularPostController.handle(httpRequest)

      expect(errorSpy).toHaveBeenCalledWith(exception)
      expect(httpResponse).toEqual(error(exception))
    })
  })
})
