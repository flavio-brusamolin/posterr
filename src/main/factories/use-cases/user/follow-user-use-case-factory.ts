import { UserSignatureProxy } from '../../../../application/guards/user-signature-proxy'
import { FollowUserService } from '../../../../application/services/user/follow-user-service'
import { FollowUserUseCase } from '../../../../domain/use-cases/user/follow-user-use-case'
import { UserMongoRepository } from '../../../../infrastructure/database/mongo/user/user-mongo-repository'

export const makeFollowUserUseCase = (): FollowUserUseCase => {
  const userMongoRepository = new UserMongoRepository()
  const followUserService = new FollowUserService(userMongoRepository, userMongoRepository)
  return new UserSignatureProxy(userMongoRepository, followUserService)
}
