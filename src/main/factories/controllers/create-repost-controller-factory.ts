import { Controller } from '../../../interfaces/http/controllers/controller'
import { CreateRepostController } from '../../../interfaces/http/controllers/create-repost-controller'
import { makeCreateRepostUseCase } from '../use-cases/create-repost-use-case-factory'

export const makeCreateRepostController = (): Controller => {
  const createRepostUseCase = makeCreateRepostUseCase()
  return new CreateRepostController(createRepostUseCase)
}
