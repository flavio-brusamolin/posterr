import { Controller } from '../../../../interfaces/http/controllers/controller'
import { CreateRegularPostController } from '../../../../interfaces/http/controllers/post/create-regular-post-controller'
import { makeCreateRegularPostUseCase } from '../../use-cases/post/create-regular-post-use-case-factory'
import { makeCreateRegularPostValidator } from '../../validators/post/create-regular-post-validator-factory'

export const makeCreateRegularPostController = (): Controller => {
  const createRegularPostValidator = makeCreateRegularPostValidator()
  const createRegularPostUseCase = makeCreateRegularPostUseCase()
  return new CreateRegularPostController(createRegularPostValidator, createRegularPostUseCase)
}
