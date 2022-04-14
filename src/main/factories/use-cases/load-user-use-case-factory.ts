import { UserSignatureProxy } from '../../../application/guards/user-signature-proxy'
import { LoadUserService } from '../../../application/services/load-user-service'
import { LoadUserUseCase } from '../../../domain/use-cases/load-User-use-case'
import { UserMongoRepository } from '../../../infrastructure/database/mongo/user/user-mongo-repository'

export const makeLoadUserUseCase = (): LoadUserUseCase => {
  const userMongoRepository = new UserMongoRepository()
  const loadUserService = new LoadUserService(userMongoRepository)
  return new UserSignatureProxy(userMongoRepository, loadUserService)
}
