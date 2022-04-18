import { Controller } from '../../../../interfaces/http/controllers/controller'
import { LoadUserController } from '../../../../interfaces/http/controllers/user/load-user-controller'
import { makeLoadUserUseCase } from '../../use-cases/user/load-user-use-case-factory'
import { makeLoadUserValidator } from '../../validators/user/load-user-validator-factory'

export const makeLoadUserController = (): Controller => {
  const loadUserValidator = makeLoadUserValidator()
  const loadUserUseCase = makeLoadUserUseCase()
  return new LoadUserController(loadUserValidator, loadUserUseCase)
}
