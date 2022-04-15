import { Controller } from '../../../../interfaces/http/controllers/controller'
import { LoadUserController } from '../../../../interfaces/http/controllers/user/load-user-controller'
import { makeLoadUserUseCase } from '../../use-cases/user/load-user-use-case-factory'

export const makeLoadUserController = (): Controller => {
  const loadUserUseCase = makeLoadUserUseCase()
  return new LoadUserController(loadUserUseCase)
}
