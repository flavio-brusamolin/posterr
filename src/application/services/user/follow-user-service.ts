import { UserNotFoundError } from '../../../domain/errors'
import { FollowUserInput, FollowUserUseCase } from '../../../domain/use-cases/user/follow-user-use-case'
import { LoadUserRepository } from '../../contracts/database/user/load-user-repository'
import { UpdateUserRepository } from '../../contracts/database/user/update-user-repository'

export class FollowUserService implements FollowUserUseCase {
  constructor (
    private readonly loadUserRepository: LoadUserRepository,
    private readonly updateUserRepository: UpdateUserRepository
  ) { }

  async execute ({ userId, targetUserId }: FollowUserInput): Promise<void> {
    const targetUser = await this.loadUserRepository.loadUser(targetUserId)
    if (!targetUser) {
      throw new UserNotFoundError()
    }

    const currentUser = await this.loadUserRepository.loadUser(userId)
    currentUser.follow(targetUser)

    await this.updateUserRepository.updateUser(currentUser.getUserId(), currentUser)
    await this.updateUserRepository.updateUser(targetUser.getUserId(), targetUser)
  }
}
