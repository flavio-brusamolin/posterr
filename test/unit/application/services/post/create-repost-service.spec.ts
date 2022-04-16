import { CountTodayPostsRepository } from '../../../../../src/application/contracts/database/post/count-today-posts-repository'
import { CreateRepostRepository } from '../../../../../src/application/contracts/database/post/create-repost-repository'
import { LoadPostRepository } from '../../../../../src/application/contracts/database/post/load-post-repository'
import { IdentifierGenerator } from '../../../../../src/application/contracts/support/identifier-generator'
import { CreateRepostService } from '../../../../../src/application/services/post/create-repost-service'
import { Post } from '../../../../../src/domain/aggregates/post'
import { RegularPost } from '../../../../../src/domain/entities/regular-post'
import { Repost } from '../../../../../src/domain/entities/repost'
import { POST_LIMIT_PER_DAY } from '../../../../../src/domain/enums/constants'
import { PostLimitError, PostNotFoundError, RepostChainError } from '../../../../../src/domain/errors'
import { EventDispatcher } from '../../../../../src/domain/events/event-dispatcher'
import { PostCreatedEvent } from '../../../../../src/domain/events/post-created-event'
import { generateRegularPostInput, generateRepostInput } from '../../../../support/models'

const fakeRepost = new Repost(generateRepostInput())
const fakeRegularPost = new RegularPost(generateRegularPostInput())

const makeFakeInput = () => ({
  userId: 'any_user_id',
  originalPostId: 'any_post_id',
  comment: 'any_comment'
})

const makeCountTodayPostsRepository = (): CountTodayPostsRepository => {
  class CountTodayPostsRepositoryStub implements CountTodayPostsRepository {
    async countTodayPosts (_userId: string): Promise<number> {
      return 0
    }
  }

  return new CountTodayPostsRepositoryStub()
}

const makeLoadPostRepository = (): LoadPostRepository => {
  class LoadPostRepositoryStub implements LoadPostRepository {
    async loadPost (_postId: string): Promise<Post> {
      return fakeRegularPost
    }
  }

  return new LoadPostRepositoryStub()
}

const makeIdentifierGenerator = (): IdentifierGenerator => {
  class IdentifierGeneratorStub implements IdentifierGenerator {
    generateId (): string {
      return 'any_id'
    }
  }

  return new IdentifierGeneratorStub()
}

const makeCreateRepostRepository = (): CreateRepostRepository => {
  class CreateRepostRepositoryStub implements CreateRepostRepository {
    async createRepost (_repost: Repost): Promise<Repost> {
      return fakeRepost
    }
  }

  return new CreateRepostRepositoryStub()
}

interface SutTypes {
  createRepostService: CreateRepostService
  countTodayPostsRepositoryStub: CountTodayPostsRepository
  loadPostRepositoryStub: LoadPostRepository
  identifierGeneratorStub: IdentifierGenerator
  createRepostRepositoryStub: CreateRepostRepository
}

const makeSut = (): SutTypes => {
  const countTodayPostsRepositoryStub = makeCountTodayPostsRepository()
  const loadPostRepositoryStub = makeLoadPostRepository()
  const identifierGeneratorStub = makeIdentifierGenerator()
  const createRepostRepositoryStub = makeCreateRepostRepository()

  const createRepostService = new CreateRepostService(
    countTodayPostsRepositoryStub,
    loadPostRepositoryStub,
    identifierGeneratorStub,
    createRepostRepositoryStub
  )

  return {
    createRepostService,
    countTodayPostsRepositoryStub,
    loadPostRepositoryStub,
    identifierGeneratorStub,
    createRepostRepositoryStub
  }
}

describe('CreateRepostService', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern').setSystemTime(new Date())
  })

  describe('#execute', () => {
    it('should call LoadPostRepository with correct values', async () => {
      const { createRepostService, loadPostRepositoryStub } = makeSut()
      const loadPostSpy = jest.spyOn(loadPostRepositoryStub, 'loadPost')

      const repostData = makeFakeInput()
      await createRepostService.execute(repostData)

      expect(loadPostSpy).toHaveBeenCalledWith(repostData.originalPostId)
    })

    it('should throw a post not found error when the original post is not found', async () => {
      const { createRepostService, loadPostRepositoryStub } = makeSut()
      jest.spyOn(loadPostRepositoryStub, 'loadPost').mockResolvedValueOnce(null)

      const repostData = makeFakeInput()
      const promise = createRepostService.execute(repostData)

      const error = new PostNotFoundError()
      await expect(promise).rejects.toThrow(error)
    })

    it('should throw a repost chain error when the original post is a repost', async () => {
      const { createRepostService, loadPostRepositoryStub } = makeSut()
      jest.spyOn(loadPostRepositoryStub, 'loadPost').mockResolvedValueOnce(fakeRepost)

      const repostData = makeFakeInput()
      const promise = createRepostService.execute(repostData)

      const error = new RepostChainError()
      await expect(promise).rejects.toThrow(error)
    })

    it('should call CountTodayPostsRepository with correct values', async () => {
      const { createRepostService, countTodayPostsRepositoryStub } = makeSut()
      const countTodayPostsSpy = jest.spyOn(countTodayPostsRepositoryStub, 'countTodayPosts')

      const repostData = makeFakeInput()
      await createRepostService.execute(repostData)

      expect(countTodayPostsSpy).toHaveBeenCalledWith(repostData.userId)
    })

    it('should throw a post limit error when the post limit per day is reached', async () => {
      const { createRepostService, countTodayPostsRepositoryStub } = makeSut()
      jest.spyOn(countTodayPostsRepositoryStub, 'countTodayPosts').mockResolvedValueOnce(POST_LIMIT_PER_DAY)

      const repostData = makeFakeInput()
      const promise = createRepostService.execute(repostData)

      const error = new PostLimitError()
      await expect(promise).rejects.toThrow(error)
    })

    it('should call IdentifierGenerator with correct values', async () => {
      const { createRepostService, identifierGeneratorStub } = makeSut()
      const generateIdSpy = jest.spyOn(identifierGeneratorStub, 'generateId')

      const repostData = makeFakeInput()
      await createRepostService.execute(repostData)

      expect(generateIdSpy).toHaveBeenCalled()
    })

    it('should call CreateRepostRepository with correct values', async () => {
      const { createRepostService, createRepostRepositoryStub } = makeSut()
      const createRepostSpy = jest.spyOn(createRepostRepositoryStub, 'createRepost')

      const repostData = makeFakeInput()
      await createRepostService.execute(repostData)

      const { userId, comment } = repostData
      const repost = new Repost({ postId: 'any_id', userId, comment, originalPost: fakeRegularPost })
      expect(createRepostSpy).toHaveBeenCalledWith(repost)
    })

    it('should call EventDispatcher with correct values', async () => {
      const { createRepostService } = makeSut()
      const fireSpy = jest.spyOn(EventDispatcher, 'fire')

      const repostData = makeFakeInput()
      await createRepostService.execute(repostData)

      expect(fireSpy).toHaveBeenCalledWith(new PostCreatedEvent(fakeRepost))
    })

    it('should return the created repost', async () => {
      const { createRepostService } = makeSut()

      const repostData = makeFakeInput()
      const createdRepost = await createRepostService.execute(repostData)

      expect(createdRepost).toEqual(fakeRepost)
    })
  })
})
