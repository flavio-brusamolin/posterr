import { UserSignatureProxy } from '../../../application/guards/user-signature-proxy'
import { LoadPostsService } from '../../../application/services/load-posts-service'
import { LoadPostsUseCase } from '../../../domain/use-cases/load-posts-use-case'
import { PostMongoRepository } from '../../../infrastructure/database/mongo/post/post-mongo-repository'
import { UserMongoRepository } from '../../../infrastructure/database/mongo/user/user-mongo-repository'

export const makeLoadPostsUseCase = (): LoadPostsUseCase => {
  const userMongoRepository = new UserMongoRepository()
  const postMongoRepository = new PostMongoRepository()
  const loadPostsService = new LoadPostsService(userMongoRepository, postMongoRepository)
  return new UserSignatureProxy(userMongoRepository, loadPostsService)
}
