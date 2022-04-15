import { PostLimitError } from '../../domain/errors/post-limit-error'
import { RepostChainError } from '../../domain/errors/repost-chain-error'
import { Repost } from '../../domain/entities/repost'
import { CreateRepostInput, CreateRepostUseCase } from '../../domain/use-cases/create-repost-use-case'
import { CountTodayPostsRepository } from '../contracts/count-today-posts-repository'
import { CreateRepostRepository } from '../contracts/create-repost-repository'
import { IdentifierGenerator } from '../contracts/identifier-generator'
import { LoadPostRepository } from '../contracts/load-post-repository'
import { PostNotFoundError } from '../../domain/errors/post-not-found-error'
import { EventDispatcher } from '../../domain/events/event-dispatcher'
import { PostCreatedEvent } from '../../domain/events/post-created-event'
import { POST_LIMIT_PER_DAY } from '../../domain/enums/constants'

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
