import { RegularPost } from '../../../../../../src/domain/entities/regular-post'
import { PostLimitError } from '../../../../../../src/domain/errors'
import { CreateRegularPostInput, CreateRegularPostUseCase } from '../../../../../../src/domain/use-cases/post/create-regular-post-use-case'
import { CreateRegularPostController } from '../../../../../../src/interfaces/http/controllers/post/create-regular-post-controller'
import { created, error } from '../../../../../../src/interfaces/http/helpers/http-response-builder'
import { generateRegularPostInput } from '../../../../../support/models'

const fakeRegularPost = new RegularPost(generateRegularPostInput())

const makeFakeRequest = () => ({
  headers: { 'user-id': 'any_user_id' },
  body: { content: 'any_content' }
})

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
  createRegularPostUseCaseStub: CreateRegularPostUseCase
}

const makeSut = (): SutTypes => {
  const createRegularPostUseCaseStub = makeCreateRegularPostUseCase()

  const createRegularPostController = new CreateRegularPostController(createRegularPostUseCaseStub)

  return {
    createRegularPostController,
    createRegularPostUseCaseStub
  }
}

describe('CreateRegularPostController', () => {
  describe('#handle', () => {
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
