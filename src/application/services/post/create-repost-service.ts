import { PostLimitError, RepostChainError, PostNotFoundError } from '../../../domain/errors'
import { Repost } from '../../../domain/entities/repost'
import { CreateRepostInput, CreateRepostUseCase } from '../../../domain/use-cases/post/create-repost-use-case'
import { CountTodayPostsRepository } from '../../contracts/database/post/count-today-posts-repository'
import { CreateRepostRepository } from '../../contracts/database/post/create-repost-repository'
import { IdentifierGenerator } from '../../contracts/support/identifier-generator'
import { LoadPostRepository } from '../../contracts/database/post/load-post-repository'
import { EventDispatcher } from '../../../domain/events/event-dispatcher'
import { PostCreatedEvent } from '../../../domain/events/post-created-event'
import { POST_LIMIT_PER_DAY } from '../../../domain/enums/constants'

export class CreateRepostService implements CreateRepostUseCase {
  constructor (
    private readonly countTodayPostsRepository: CountTodayPostsRepository,
    private readonly loadPostRepository: LoadPostRepository,
    private readonly identifierGenerator: IdentifierGenerator,
    private readonly createRepostRepository: CreateRepostRepository
  ) { }

  async execute ({ userId, originalPostId, comment }: CreateRepostInput): Promise<Repost> {
    const originalPost = await this.loadPostRepository.loadPost(originalPostId)
    if (!originalPost) {
      throw new PostNotFoundError()
    }
    if (originalPost instanceof Repost) {
      throw new RepostChainError()
    }

    const numberOfTodayPosts = await this.countTodayPostsRepository.countTodayPosts(userId)
    if (numberOfTodayPosts >= POST_LIMIT_PER_DAY) {
      throw new PostLimitError()
    }

    const postId = this.identifierGenerator.generateId()
    const repost = new Repost({ postId, userId, originalPost, comment })
    const createdRepost = await this.createRepostRepository.createRepost(repost)

    EventDispatcher.fire(new PostCreatedEvent(createdRepost))

    return createdRepost
  }
}
