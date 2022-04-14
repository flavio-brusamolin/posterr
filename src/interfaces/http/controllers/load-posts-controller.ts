import { Post } from '../../../domain/aggregates/post'
import { FromOption } from '../../../domain/enums/from-option'
import { LoadPostsUseCase } from '../../../domain/use-cases/load-posts-use-case'
import { ErrorResponse } from '../contracts/error-response'
import { HttpRequest } from '../contracts/http-request'
import { HttpResponse } from '../contracts/http-response'
import { SignatureHeader } from '../contracts/signature-header'
import { Controller } from './controller'
import { ok, error } from '../helpers/http-response-builder'

type RequestQuery = { from?: FromOption }
type ResponseBody = Post[] | ErrorResponse

export class LoadPostsController implements Controller {
  constructor (private readonly loadPostsUseCase: LoadPostsUseCase) { }

  async handle ({ headers, query }: HttpRequest<any, SignatureHeader, any, RequestQuery>): Promise<HttpResponse<ResponseBody>> {
    try {
      const { 'user-id': userId } = headers
      const { from } = query

      const posts = await this.loadPostsUseCase.execute({ userId, from })

      return ok(posts)
    } catch (exception) {
      console.error(exception)
      return error(exception)
    }
  }
}
