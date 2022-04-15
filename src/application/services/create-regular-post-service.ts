import { PostLimitError } from '../../domain/errors/post-limit-error'
import { RegularPost } from '../../domain/entities/regular-post'
import { CreateRegularPostInput, CreateRegularPostUseCase } from '../../domain/use-cases/create-regular-post-use-case'
import { CountTodayPostsRepository } from '../contracts/count-today-posts-repository'
import { CreateRegularPostRepository } from '../contracts/create-regular-post-repository'
import { IdentifierGenerator } from '../contracts/identifier-generator'
import { PostCreatedEvent } from '../../domain/events/post-created-event'
import { EventDispatcher } from '../../domain/events/event-dispatcher'
import { POST_LIMIT_PER_DAY } from '../../domain/enums/constants'

export class CreateRegularPostService implements CreateRegularPostUseCase {
  constructor (
    private readonly countTodayPostsRepository: CountTodayPostsRepository,
    private readonly identifierGenerator: IdentifierGenerator,
    private readonly createRegularPostRepository: CreateRegularPostRepository
  ) { }

  async execute ({ userId, content }: CreateRegularPostInput): Promise<RegularPost> {
    const numberOfTodayPosts = await this.countTodayPostsRepository.countTodayPosts(userId)
    if (numberOfTodayPosts >= POST_LIMIT_PER_DAY) {
      throw new PostLimitError()
    }

    const postId = this.identifierGenerator.generateId()
    const regularPost = new RegularPost({ postId, userId, content })
    const createdRegularPost = await this.createRegularPostRepository.createRegularPost(regularPost)

    EventDispatcher.fire(new PostCreatedEvent(createdRegularPost))

    return createdRegularPost
  }
}
