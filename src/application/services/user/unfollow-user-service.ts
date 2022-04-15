import { UserNotFoundError } from '../../../domain/errors'
import { UnfollowUserInput, UnfollowUserUseCase } from '../../../domain/use-cases/user/unfollow-user-use-case'
import { LoadUserRepository } from '../../contracts/database/user/load-user-repository'
import { UpdateUserRepository } from '../../contracts/database/user/update-user-repository'

export class UnfollowUserService implements UnfollowUserUseCase {
  constructor (
    private readonly loadUserRepository: LoadUserRepository,
    private readonly updateUserRepository: UpdateUserRepository
  ) { }

  async execute ({ userId, targetUserId }: UnfollowUserInput): Promise<void> {
    const targetUser = await this.loadUserRepository.loadUser(targetUserId)
    if (!targetUser) {
      throw new UserNotFoundError()
    }

    const currentUser = await this.loadUserRepository.loadUser(userId)
    currentUser.unfollow(targetUser)

    await this.updateUserRepository.updateUser(currentUser.getUserId(), currentUser)
    await this.updateUserRepository.updateUser(targetUser.getUserId(), targetUser)
  }
}
