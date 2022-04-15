import { UserSignatureProxy } from '../../../../application/guards/user-signature-proxy'
import { UnfollowUserService } from '../../../../application/services/user/unfollow-user-service'
import { UnfollowUserUseCase } from '../../../../domain/use-cases/user/unfollow-user-use-case'
import { UserMongoRepository } from '../../../../infrastructure/database/mongo/user/user-mongo-repository'

export const makeUnfollowUserUseCase = (): UnfollowUserUseCase => {
  const userMongoRepository = new UserMongoRepository()
  const unfollowUserService = new UnfollowUserService(userMongoRepository, userMongoRepository)
  return new UserSignatureProxy(userMongoRepository, unfollowUserService)
}
