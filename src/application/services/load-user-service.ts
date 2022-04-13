import { UserNotFoundError } from '../../domain/errors/user-not-found-error'
import { LoadUserInput, LoadUserUseCase, SerializedUser } from '../../domain/use-cases/load-user-use-case'
import { LoadUserRepository } from '../contracts/load-user-repository'

export class LoadUserService implements LoadUserUseCase {
  constructor (private readonly loadUserRepository: LoadUserRepository) { }

  async execute ({ userId, targetUserId }: LoadUserInput): Promise<SerializedUser> {
    const targetUser = await this.loadUserRepository.loadUser(targetUserId)
    if (!targetUser) {
      throw new UserNotFoundError()
    }

    const followingNow = targetUser.isFollowedBy(userId)

    return {
      ...targetUser,
      followingNow
    }
  }
}
