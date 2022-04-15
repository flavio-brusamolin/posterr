import { PostLimitError } from '../../domain/errors/post-limit-error'
import { RegularPost } from '../../domain/entities/regular-post'
import { CreateRegularPostInput, CreateRegularPostUseCase } from '../../domain/use-cases/create-regular-post-use-case'
import { CountTodayPostsRepository } from '../contracts/count-today-posts-repository'
import { CreateRegularPostRepository } from '../contracts/create-regular-post-repository'
import { IdentifierGenerator } from '../contracts/identifier-generator'
import { UpdateUserRepository } from '../contracts/update-user-repository'
import { LoadUserRepository } from '../contracts/load-user-repository'

export class CreateRegularPostService implements CreateRegularPostUseCase {
  constructor (
    private readonly countTodayPostsRepository: CountTodayPostsRepository,
    private readonly identifierGenerator: IdentifierGenerator,
    private readonly createRegularPostRepository: CreateRegularPostRepository,
    private readonly loadUserRepository: LoadUserRepository,
    private readonly updateUserRepository: UpdateUserRepository
  ) { }

  async execute ({ userId, content }: CreateRegularPostInput): Promise<RegularPost> {
    const POST_LIMIT_PER_DAY = 5
    const numberOfTodayPosts = await this.countTodayPostsRepository.countTodayPosts(userId)
    if (numberOfTodayPosts >= POST_LIMIT_PER_DAY) {
      throw new PostLimitError()
    }

    const postId = this.identifierGenerator.generateId()
    const regularPost = new RegularPost({ postId, userId, content })
    const createdRegularPost = await this.createRegularPostRepository.createRegularPost(regularPost)

    const user = await this.loadUserRepository.loadUser(userId)
    user.incrementNumberOfPosts()
    await this.updateUserRepository.updateUser(user.getUserId(), user)

    return createdRegularPost
  }
}
