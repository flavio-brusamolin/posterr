import { Controller } from '../../../interfaces/http/controllers/controller'
import { LoadUserController } from '../../../interfaces/http/controllers/load-user-controller'
import { makeLoadUserUseCase } from '../use-cases/load-user-use-case-factory'

export const makeLoadUserController = (): Controller => {
  const loadUserUseCase = makeLoadUserUseCase()
  return new LoadUserController(loadUserUseCase)
}
