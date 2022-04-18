import { Controller } from '../../../../interfaces/http/controllers/controller'
import { FollowUserController } from '../../../../interfaces/http/controllers/user/follow-user-controller'
import { makeFollowUserUseCase } from '../../use-cases/user/follow-user-use-case-factory'
import { makeFollowUserValidator } from '../../validators/user/follow-user-validator-factory'

export const makeFollowUserController = (): Controller => {
  const followUserValidator = makeFollowUserValidator()
  const followUserUseCase = makeFollowUserUseCase()
  return new FollowUserController(followUserValidator, followUserUseCase)
}
