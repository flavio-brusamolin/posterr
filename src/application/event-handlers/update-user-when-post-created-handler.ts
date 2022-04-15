import { EventHandler } from '../../domain/events/contracts/event-handler'
import { PostCreatedEvent } from '../../domain/events/post-created-event'
import { LoadUserRepository } from '../contracts/database/user/load-user-repository'
import { UpdateUserRepository } from '../contracts/database/user/update-user-repository'

export class UpdateUserWhenPostCreatedHandler implements EventHandler<PostCreatedEvent> {
  constructor (
    private readonly loadUserRepository: LoadUserRepository,
    private readonly updateUserRepository: UpdateUserRepository
  ) { }

  async handle ({ data: post }: PostCreatedEvent): Promise<void> {
    try {
      const user = await this.loadUserRepository.loadUser(post.getUserId())
      user.updatePostHistory(post)
      await this.updateUserRepository.updateUser(user.getUserId(), user)
    } catch (exception) {
      console.error(exception)
    }
  }
}
