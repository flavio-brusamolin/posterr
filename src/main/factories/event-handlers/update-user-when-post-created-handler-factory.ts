import { UpdateUserWhenPostCreatedHandler } from '../../../application/event-handlers/update-user-when-post-created-handler'
import { EventHandler } from '../../../domain/events/contracts/event-handler'
import { UserMongoRepository } from '../../../infrastructure/database/mongo/user/user-mongo-repository'

export const makeUpdateUserWhenPostCreatedHandler = (): EventHandler => {
  const userMongoRepository = new UserMongoRepository()
  return new UpdateUserWhenPostCreatedHandler(userMongoRepository, userMongoRepository)
}
