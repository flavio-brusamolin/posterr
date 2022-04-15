import { FromOption } from '../../../domain/enums/from-option'
import { Post } from '../../../domain/aggregates/post'
import { LoadPostsInput, LoadPostsUseCase } from '../../../domain/use-cases/post/load-posts-use-case'
import { LoadPostsRepository } from '../../contracts/database/post/load-posts-repository'
import { LoadUserRepository } from '../../contracts/database/user/load-user-repository'

export class LoadPostsService implements LoadPostsUseCase {
  constructor (
    private readonly loadUserRepository: LoadUserRepository,
    private readonly loadPostsRepository: LoadPostsRepository
  ) { }

  async execute ({ userId, from = FromOption.ALL }: LoadPostsInput): Promise<Post[]> {
    if (from === FromOption.FOLLOWING) {
      const user = await this.loadUserRepository.loadUser(userId)
      return await this.loadPostsRepository.loadPosts(user.getFollowing())
    }

    return await this.loadPostsRepository.loadPosts()
  }
}
