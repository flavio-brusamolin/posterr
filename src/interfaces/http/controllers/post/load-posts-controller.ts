import { Post } from '../../../../domain/aggregates/post'
import { FromOption } from '../../../../domain/enums/from-option'
import { LoadPostsUseCase } from '../../../../domain/use-cases/post/load-posts-use-case'
import { ErrorResponse, HttpRequest, HttpResponse, SignatureHeader, Validator } from '../../contracts'
import { Controller } from '../controller'
import { ok, error } from '../../helpers/http-response-builder'

type RequestQuery = { from?: FromOption }
type ResponseBody = Post[] | ErrorResponse

export class LoadPostsController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly loadPostsUseCase: LoadPostsUseCase
  ) { }

  async handle (httpRequest: HttpRequest<any, SignatureHeader, any, RequestQuery>): Promise<HttpResponse<ResponseBody>> {
    try {
      this.validator.validate(httpRequest)

      const { 'user-id': userId } = httpRequest.headers
      const { from } = httpRequest.query

      const posts = await this.loadPostsUseCase.execute({ userId, from })

      return ok(posts)
    } catch (exception) {
      console.error(exception)
      return error(exception)
    }
  }
}
