import { LoadPostsRepository } from '../../../../../src/application/contracts/database/post/load-posts-repository'
import { LoadUserRepository } from '../../../../../src/application/contracts/database/user/load-user-repository'
import { LoadPostsService } from '../../../../../src/application/services/post/load-posts-service'
import { Post } from '../../../../../src/domain/aggregates/post'
import { RegularPost } from '../../../../../src/domain/entities/regular-post'
import { User } from '../../../../../src/domain/entities/user'
import { FromOption } from '../../../../../src/domain/enums/from-option'
import { generateRegularPostInput, generateUserInput } from '../../../../support/models'

const fakePost = new RegularPost(generateRegularPostInput())
const fakeUser = new User(generateUserInput())

const makeFakeInput = (from = FromOption.ALL) => ({
  userId: 'any_user_id',
  from
})

const makeLoadUserRepository = (): LoadUserRepository => {
  class LoadUserRepositoryStub implements LoadUserRepository {
    async loadUser (_userId: string): Promise<User> {
      return fakeUser
    }
  }

  return new LoadUserRepositoryStub()
}

const makeLoadPostsRepository = (): LoadPostsRepository => {
  class LoadPostsRepositoryStub implements LoadPostsRepository {
    async loadPosts (_userIds?: string[]): Promise<Post[]> {
      return [fakePost]
    }
  }

  return new LoadPostsRepositoryStub()
}

interface SutTypes {
  loadPostsService: LoadPostsService
  loadUserRepositoryStub: LoadUserRepository
  loadPostsRepositoryStub: LoadPostsRepository
}

const makeSut = (): SutTypes => {
  const loadUserRepositoryStub = makeLoadUserRepository()
  const loadPostsRepositoryStub = makeLoadPostsRepository()

  const loadPostsService = new LoadPostsService(
    loadUserRepositoryStub,
    loadPostsRepositoryStub
  )

  return {
    loadPostsService,
    loadUserRepositoryStub,
    loadPostsRepositoryStub
  }
}

describe('LoadPostsService', () => {
  describe('#execute', () => {
    describe('when from option is following', () => {
      it('should call LoadUserRepository with correct values', async () => {
        const { loadPostsService, loadUserRepositoryStub } = makeSut()
        const loadUserSpy = jest.spyOn(loadUserRepositoryStub, 'loadUser')

        const input = makeFakeInput(FromOption.FOLLOWING)
        await loadPostsService.execute(input)

        expect(loadUserSpy).toHaveBeenCalledWith(input.userId)
      })

      it('should call LoadPostsRepository with correct values', async () => {
        const { loadPostsService, loadPostsRepositoryStub } = makeSut()
        const loadPostsSpy = jest.spyOn(loadPostsRepositoryStub, 'loadPosts')

        const input = makeFakeInput(FromOption.FOLLOWING)
        await loadPostsService.execute(input)

        expect(loadPostsSpy).toHaveBeenCalledWith(fakeUser.getFollowing())
      })
    })

    describe('when from option is all', () => {
      it('should call LoadPostsRepository with correct values', async () => {
        const { loadPostsService, loadPostsRepositoryStub } = makeSut()
        const loadPostsSpy = jest.spyOn(loadPostsRepositoryStub, 'loadPosts')

        const input = makeFakeInput()
        await loadPostsService.execute(input)

        expect(loadPostsSpy).toHaveBeenCalled()
      })
    })

    describe('when from option is not received', () => {
      it('should call LoadPostsRepository with correct values', async () => {
        const { loadPostsService, loadPostsRepositoryStub } = makeSut()
        const loadPostsSpy = jest.spyOn(loadPostsRepositoryStub, 'loadPosts')

        const { userId } = makeFakeInput()
        await loadPostsService.execute({ userId })

        expect(loadPostsSpy).toHaveBeenCalled()
      })
    })

    it('should return the retrieved posts', async () => {
      const { loadPostsService } = makeSut()

      const input = makeFakeInput()
      const posts = await loadPostsService.execute(input)

      expect(posts).toEqual([fakePost])
    })
  })
})
