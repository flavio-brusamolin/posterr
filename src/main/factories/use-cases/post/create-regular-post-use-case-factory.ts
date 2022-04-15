import { UserSignatureProxy } from '../../../../application/guards/user-signature-proxy'
import { CreateRegularPostService } from '../../../../application/services/post/create-regular-post-service'
import { CreateRegularPostUseCase } from '../../../../domain/use-cases/post/create-regular-post-use-case'
import { PostMongoRepository } from '../../../../infrastructure/database/mongo/post/post-mongo-repository'
import { UserMongoRepository } from '../../../../infrastructure/database/mongo/user/user-mongo-repository'
import { UUIDAdapter } from '../../../../infrastructure/support/uuid/uuid-adapter'

export const makeCreateRegularPostUseCase = (): CreateRegularPostUseCase => {
  const postMongoRepository = new PostMongoRepository()
  const userMongoRepository = new UserMongoRepository()
  const uuidAdapter = new UUIDAdapter()
  const createRegularPostService = new CreateRegularPostService(postMongoRepository, uuidAdapter, postMongoRepository)
  return new UserSignatureProxy(userMongoRepository, createRegularPostService)
}
