import { Controller } from '../../../../interfaces/http/controllers/controller'
import { UnfollowUserController } from '../../../../interfaces/http/controllers/user/unfollow-user-controller'
import { makeUnfollowUserUseCase } from '../../use-cases/user/unfollow-user-use-case-factory'

export const makeUnfollowUserController = (): Controller => {
  const unfollowUserUseCase = makeUnfollowUserUseCase()
  return new UnfollowUserController(unfollowUserUseCase)
}
