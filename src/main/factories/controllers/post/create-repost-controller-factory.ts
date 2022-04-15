import { Controller } from '../../../../interfaces/http/controllers/controller'
import { CreateRepostController } from '../../../../interfaces/http/controllers/post/create-repost-controller'
import { makeCreateRepostUseCase } from '../../use-cases/post/create-repost-use-case-factory'

export const makeCreateRepostController = (): Controller => {
  const createRepostUseCase = makeCreateRepostUseCase()
  return new CreateRepostController(createRepostUseCase)
}
