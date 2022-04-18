import { Repost } from '../../../../../../src/domain/entities/repost'
import { PostLimitError } from '../../../../../../src/domain/errors'
import { CreateRepostInput, CreateRepostUseCase } from '../../../../../../src/domain/use-cases/post/create-repost-use-case'
import { Validator } from '../../../../../../src/interfaces/http/contracts'
import { CreateRepostController } from '../../../../../../src/interfaces/http/controllers/post/create-repost-controller'
import { created, error } from '../../../../../../src/interfaces/http/helpers/http-response-builder'
import { generateRepostInput } from '../../../../../support/models'

const fakeRepost = new Repost(generateRepostInput())

const makeFakeRequest = () => ({
  headers: { 'user-id': 'any_user_id' },
  params: { postId: 'any_post_id' },
  body: { comment: 'any_comment' }
})

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (_input: any): void {
      // do nothing
    }
  }

  return new ValidatorStub()
}

const makeCreateRepostUseCase = (): CreateRepostUseCase => {
  class CreateRepostUseCaseStub implements CreateRepostUseCase {
    async execute (_input: CreateRepostInput): Promise<Repost> {
      return fakeRepost
    }
  }

  return new CreateRepostUseCaseStub()
}

interface SutTypes {
  createRepostController: CreateRepostController
  validatorStub: Validator
  createRepostUseCaseStub: CreateRepostUseCase
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator()
  const createRepostUseCaseStub = makeCreateRepostUseCase()

  const createRepostController = new CreateRepostController(validatorStub, createRepostUseCaseStub)

  return {
    createRepostController,
    validatorStub,
    createRepostUseCaseStub
  }
}

describe('CreateRepostController', () => {
  describe('#handle', () => {
    it('should call Validator with correct values', async () => {
      const { createRepostController, validatorStub } = makeSut()
      const validateSpy = jest.spyOn(validatorStub, 'validate')

      const httpRequest = makeFakeRequest()
      await createRepostController.handle(httpRequest)

      expect(validateSpy).toHaveBeenCalledWith(httpRequest)
    })

    it('should call CreateRepostUseCase with correct values', async () => {
      const { createRepostController, createRepostUseCaseStub } = makeSut()
      const executeSpy = jest.spyOn(createRepostUseCaseStub, 'execute')

      const httpRequest = makeFakeRequest()
      await createRepostController.handle(httpRequest)

      const { headers, params, body } = httpRequest
      expect(executeSpy).toHaveBeenCalledWith({
        userId: headers['user-id'],
        originalPostId: params.postId,
        comment: body.comment
      })
    })

    it('should return 201 and the created repost on success', async () => {
      const { createRepostController } = makeSut()

      const httpRequest = makeFakeRequest()
      const httpResponse = await createRepostController.handle(httpRequest)

      expect(httpResponse).toEqual(created(fakeRepost))
    })

    it('should log and return the error when a exception occurs', async () => {
      const { createRepostController, createRepostUseCaseStub } = makeSut()

      const exception = new PostLimitError()
      jest.spyOn(createRepostUseCaseStub, 'execute').mockRejectedValueOnce(exception)

      const errorSpy = jest.spyOn(console, 'error')

      const httpRequest = makeFakeRequest()
      const httpResponse = await createRepostController.handle(httpRequest)

      expect(errorSpy).toHaveBeenCalledWith(exception)
      expect(httpResponse).toEqual(error(exception))
    })
  })
})
