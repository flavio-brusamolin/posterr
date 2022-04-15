import { UserSignatureProxy } from '../../../application/guards/user-signature-proxy'
import { CreateRepostService } from '../../../application/services/create-repost-service'
import { CreateRepostUseCase } from '../../../domain/use-cases/create-repost-use-case'
import { PostMongoRepository } from '../../../infrastructure/database/mongo/post/post-mongo-repository'
import { UserMongoRepository } from '../../../infrastructure/database/mongo/user/user-mongo-repository'
import { UUIDAdapter } from '../../../infrastructure/support/uuid/uuid-adapter'

export const makeCreateRepostUseCase = (): CreateRepostUseCase => {
  const postMongoRepository = new PostMongoRepository()
  const userMongoRepository = new UserMongoRepository()
  const uuidAdapter = new UUIDAdapter()
  const createRepostService = new CreateRepostService(postMongoRepository, postMongoRepository, uuidAdapter, postMongoRepository, userMongoRepository, userMongoRepository)
  return new UserSignatureProxy(userMongoRepository, createRepostService)
}
