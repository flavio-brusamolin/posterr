import { CountTodayPostsRepository } from '../../../../../src/application/contracts/database/post/count-today-posts-repository'
import { CreateRegularPostRepository } from '../../../../../src/application/contracts/database/post/create-regular-post-repository'
import { IdentifierGenerator } from '../../../../../src/application/contracts/support/identifier-generator'
import { CreateRegularPostService } from '../../../../../src/application/services/post/create-regular-post-service'
import { RegularPost } from '../../../../../src/domain/entities/regular-post'
import { POST_LIMIT_PER_DAY } from '../../../../../src/domain/enums/constants'
import { PostLimitError } from '../../../../../src/domain/errors'
import { EventDispatcher } from '../../../../../src/domain/events/event-dispatcher'
import { PostCreatedEvent } from '../../../../../src/domain/events/post-created-event'
import { generateRegularPostInput } from '../../../../support/models'

const fakeRegularPost = new RegularPost(generateRegularPostInput())

const makeFakeInput = () => ({
  userId: 'any_user_id',
  content: 'any_content'
})

const makeCountTodayPostsRepository = (): CountTodayPostsRepository => {
  class CountTodayPostsRepositoryStub implements CountTodayPostsRepository {
    async countTodayPosts (_userId: string): Promise<number> {
      return 0
    }
  }

  return new CountTodayPostsRepositoryStub()
}

const makeIdentifierGenerator = (): IdentifierGenerator => {
  class IdentifierGeneratorStub implements IdentifierGenerator {
    generateId (): string {
      return 'any_id'
    }
  }

  return new IdentifierGeneratorStub()
}

const makeCreateRegularPostRepository = (): CreateRegularPostRepository => {
  class CreateRegularPostRepositoryStub implements CreateRegularPostRepository {
    async createRegularPost (_regularPost: RegularPost): Promise<RegularPost> {
      return fakeRegularPost
    }
  }

  return new CreateRegularPostRepositoryStub()
}

interface SutTypes {
  createRegularPostService: CreateRegularPostService
  countTodayPostsRepositoryStub: CountTodayPostsRepository
  identifierGeneratorStub: IdentifierGenerator
  createRegularPostRepositoryStub: CreateRegularPostRepository
}

const makeSut = (): SutTypes => {
  const countTodayPostsRepositoryStub = makeCountTodayPostsRepository()
  const identifierGeneratorStub = makeIdentifierGenerator()
  const createRegularPostRepositoryStub = makeCreateRegularPostRepository()

  const createRegularPostService = new CreateRegularPostService(
    countTodayPostsRepositoryStub,
    identifierGeneratorStub,
    createRegularPostRepositoryStub
  )

  return {
    createRegularPostService,
    countTodayPostsRepositoryStub,
    identifierGeneratorStub,
    createRegularPostRepositoryStub
  }
}

describe('CreateRegularPostService', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern').setSystemTime(new Date())
  })

  describe('#execute', () => {
    it('should call CountTodayPostsRepository with correct values', async () => {
      const { createRegularPostService, countTodayPostsRepositoryStub } = makeSut()
      const countTodayPostsSpy = jest.spyOn(countTodayPostsRepositoryStub, 'countTodayPosts')

      const regularPostData = makeFakeInput()
      await createRegularPostService.execute(regularPostData)

      expect(countTodayPostsSpy).toHaveBeenCalledWith(regularPostData.userId)
    })

    it('should throw a post limit error when the post limit per day is reached', async () => {
      const { createRegularPostService, countTodayPostsRepositoryStub } = makeSut()
      jest.spyOn(countTodayPostsRepositoryStub, 'countTodayPosts').mockResolvedValueOnce(POST_LIMIT_PER_DAY)

      const regularPostData = makeFakeInput()
      const promise = createRegularPostService.execute(regularPostData)

      const error = new PostLimitError()
      await expect(promise).rejects.toThrow(error)
    })

    it('should call IdentifierGenerator with correct values', async () => {
      const { createRegularPostService, identifierGeneratorStub } = makeSut()
      const generateIdSpy = jest.spyOn(identifierGeneratorStub, 'generateId')

      const regularPostData = makeFakeInput()
      await createRegularPostService.execute(regularPostData)

      expect(generateIdSpy).toHaveBeenCalled()
    })

    it('should call CreateRegularPostRepository with correct values', async () => {
      const { createRegularPostService, createRegularPostRepositoryStub } = makeSut()
      const createRegularPostSpy = jest.spyOn(createRegularPostRepositoryStub, 'createRegularPost')

      const regularPostData = makeFakeInput()
      await createRegularPostService.execute(regularPostData)

      const regularPost = new RegularPost({ ...regularPostData, postId: 'any_id' })
      expect(createRegularPostSpy).toHaveBeenCalledWith(regularPost)
    })

    it('should call EventDispatcher with correct values', async () => {
      const { createRegularPostService } = makeSut()
      const fireSpy = jest.spyOn(EventDispatcher, 'fire')

      const regularPostData = makeFakeInput()
      await createRegularPostService.execute(regularPostData)

      expect(fireSpy).toHaveBeenCalledWith(new PostCreatedEvent(fakeRegularPost))
    })

    it('should return the created regular post', async () => {
      const { createRegularPostService } = makeSut()

      const regularPostData = makeFakeInput()
      const createdRegularPost = await createRegularPostService.execute(regularPostData)

      expect(createdRegularPost).toEqual(fakeRegularPost)
    })
  })
})
