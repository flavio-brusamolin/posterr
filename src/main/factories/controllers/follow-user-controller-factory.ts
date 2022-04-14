import { Controller } from '../../../interfaces/http/controllers/controller'
import { FollowUserController } from '../../../interfaces/http/controllers/follow-user-controller'
import { makeFollowUserUseCase } from '../use-cases/follow-user-use-case-factory'

export const makeFollowUserController = (): Controller => {
  const followUserUseCase = makeFollowUserUseCase()
  return new FollowUserController(followUserUseCase)
}
