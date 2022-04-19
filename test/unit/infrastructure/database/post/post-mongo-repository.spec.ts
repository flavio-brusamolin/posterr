import PostMongoSchema from '../../../../../src/infrastructure/database/mongo/post/post-mongo-schema'
import PostMongoMapper from '../../../../../src/infrastructure/database/mongo/post/post-mongo-mapper'
import { PostMongoRepository } from '../../../../../src/infrastructure/database/mongo/post/post-mongo-repository'
import { RegularPost } from '../../../../../src/domain/entities/regular-post'
import { Repost } from '../../../../../src/domain/entities/repost'
import { Post } from '../../../../../src/domain/aggregates/post'
import { generateRegularPostInput, generateRepostInput } from '../../../../support/models'
import { PostType } from '../../../../../src/domain/enums/post-type'

const fakeRegularPostRecord = generateRegularPostInput()
const fakeRepostRecord = generateRepostInput()
const fakeRegularPostEntity = new RegularPost(fakeRegularPostRecord)
const fakeRepostEntity = new Repost(fakeRepostRecord)

jest.mock('../../../../../src/infrastructure/database/mongo/post/post-mongo-schema', () => ({
  create: (entity: Post) => (entity instanceof RegularPost) ? fakeRegularPostRecord : fakeRepostRecord,
  findOne: () => fakeRegularPostRecord,
  find: () => ({ sort: () => [fakeRegularPostRecord] }),
  countDocuments: () => 0
}))

jest.mock('../../../../../src/infrastructure/database/mongo/post/post-mongo-mapper', () => ({
  toDomainEntity: (record: any) => (record.type === PostType.REGULAR_POST) ? fakeRegularPostEntity : fakeRepostEntity
}))

describe('PostMongoRepository', () => {
  describe('#createRegularPost', () => {
    it('should call PostMongoSchema#create with correct values', async () => {
      const postMongoRepository = new PostMongoRepository()
      const createSpy = jest.spyOn(PostMongoSchema, 'create')

      await postMongoRepository.createRegularPost(fakeRegularPostEntity)

      expect(createSpy).toHaveBeenCalledWith(fakeRegularPostEntity)
    })

    it('should call PostMongoMapper with correct values', async () => {
      const postMongoRepository = new PostMongoRepository()
      const toDomainEntitySpy = jest.spyOn(PostMongoMapper, 'toDomainEntity')

      await postMongoRepository.createRegularPost(fakeRegularPostEntity)

      expect(toDomainEntitySpy).toHaveBeenCalledWith(fakeRegularPostRecord)
    })

    it('should return the regular post entity', async () => {
      const postMongoRepository = new PostMongoRepository()

      const regularPost = await postMongoRepository.createRegularPost(fakeRegularPostEntity)

      expect(regularPost).toEqual(fakeRegularPostEntity)
    })
  })

  describe('#createRepost', () => {
    it('should call PostMongoSchema#create with correct values', async () => {
      const postMongoRepository = new PostMongoRepository()
      const createSpy = jest.spyOn(PostMongoSchema, 'create')

      await postMongoRepository.createRepost(fakeRepostEntity)

      expect(createSpy).toHaveBeenCalledWith(fakeRepostEntity)
    })

    it('should call PostMongoMapper with correct values', async () => {
      const postMongoRepository = new PostMongoRepository()
      const toDomainEntitySpy = jest.spyOn(PostMongoMapper, 'toDomainEntity')

      await postMongoRepository.createRepost(fakeRepostEntity)

      expect(toDomainEntitySpy).toHaveBeenCalledWith(fakeRepostRecord)
    })

    it('should return the repost entity', async () => {
      const postMongoRepository = new PostMongoRepository()

      const repost = await postMongoRepository.createRepost(fakeRepostEntity)

      expect(repost).toEqual(fakeRepostEntity)
    })
  })

  describe('#loadPost', () => {
    it('should call PostMongoSchema#findOne with correct values', async () => {
      const postMongoRepository = new PostMongoRepository()
      const findOneSpy = jest.spyOn(PostMongoSchema, 'findOne')

      const postId = 'any_post_id'
      await postMongoRepository.loadPost(postId)

      expect(findOneSpy).toHaveBeenCalledWith({ postId })
    })

    it('should call PostMongoMapper with correct values', async () => {
      const postMongoRepository = new PostMongoRepository()
      const toDomainEntitySpy = jest.spyOn(PostMongoMapper, 'toDomainEntity')

      const postId = 'any_post_id'
      await postMongoRepository.loadPost(postId)

      expect(toDomainEntitySpy).toHaveBeenCalledWith(fakeRegularPostRecord)
    })

    it('should return the post entity', async () => {
      const postMongoRepository = new PostMongoRepository()

      const postId = 'any_post_id'
      const post = await postMongoRepository.loadPost(postId)

      expect(post).toEqual(fakeRegularPostEntity)
    })
  })

  describe('#loadPosts', () => {
    it('should call PostMongoSchema#find with correct values when user ids are not received', async () => {
      const postMongoRepository = new PostMongoRepository()
      const findSpy = jest.spyOn(PostMongoSchema, 'find')

      await postMongoRepository.loadPosts()

      expect(findSpy).toHaveBeenCalledWith({})
    })

    it('should call PostMongoSchema#find with correct values when user ids are received', async () => {
      const postMongoRepository = new PostMongoRepository()
      const findSpy = jest.spyOn(PostMongoSchema, 'find')

      const userIds = ['any_user_id']
      await postMongoRepository.loadPosts(userIds)

      expect(findSpy).toHaveBeenCalledWith({ userId: { $in: userIds } })
    })

    it('should call PostMongoMapper with correct values', async () => {
      const postMongoRepository = new PostMongoRepository()
      const toDomainEntitySpy = jest.spyOn(PostMongoMapper, 'toDomainEntity')

      await postMongoRepository.loadPosts()

      expect(toDomainEntitySpy).toHaveBeenCalledWith(fakeRegularPostRecord)
    })

    it('should return the post entities', async () => {
      const postMongoRepository = new PostMongoRepository()

      const posts = await postMongoRepository.loadPosts()

      expect(posts).toEqual([fakeRegularPostEntity])
    })
  })

  describe('#countTodayPosts', () => {
    beforeAll(() => {
      jest.useFakeTimers('modern').setSystemTime(new Date())
    })

    const getStartOfDay = (): Date => {
      const now = new Date()
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return startOfDay
    }

    it('should call PostMongoSchema#countDocuments with correct values', async () => {
      const postMongoRepository = new PostMongoRepository()
      const countDocumentsSpy = jest.spyOn(PostMongoSchema, 'countDocuments')

      const userId = 'any_user_id'
      await postMongoRepository.countTodayPosts(userId)

      const startOfDay = getStartOfDay()
      expect(countDocumentsSpy).toHaveBeenCalledWith({
        userId,
        createdAt: { $gte: startOfDay }
      })
    })

    it('should return the number of posts', async () => {
      const postMongoRepository = new PostMongoRepository()

      const userId = 'any_user_id'
      const numberOfPosts = await postMongoRepository.countTodayPosts(userId)

      expect(numberOfPosts).toBe(0)
    })
  })
})
