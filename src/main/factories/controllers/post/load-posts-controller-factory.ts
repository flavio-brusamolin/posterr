import { Controller } from '../../../../interfaces/http/controllers/controller'
import { LoadPostsController } from '../../../../interfaces/http/controllers/post/load-posts-controller'
import { makeLoadPostsUseCase } from '../../use-cases/post/load-posts-use-case-factory'

export const makeLoadPostsController = (): Controller => {
  const loadPostsUseCase = makeLoadPostsUseCase()
  return new LoadPostsController(loadPostsUseCase)
}
