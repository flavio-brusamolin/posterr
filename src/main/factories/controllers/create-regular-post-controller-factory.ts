import { Controller } from '../../../interfaces/http/controllers/controller'
import { CreateRegularPostController } from '../../../interfaces/http/controllers/create-regular-post-controller'
import { makeCreateRegularPostUseCase } from '../use-cases/create-regular-post-use-case-factory'

export const makeCreateRegularPostController = (): Controller => {
  const createRegularPostUseCase = makeCreateRegularPostUseCase()
  return new CreateRegularPostController(createRegularPostUseCase)
}
