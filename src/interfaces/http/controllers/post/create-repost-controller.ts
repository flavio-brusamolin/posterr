import { Repost } from '../../../../domain/entities/repost'
import { CreateRepostUseCase } from '../../../../domain/use-cases/post/create-repost-use-case'
import { Controller } from '../controller'
import { ErrorResponse, HttpRequest, HttpResponse, SignatureHeader, Validator } from '../../contracts'
import { created, error } from '../../helpers/http-response-builder'

type RequestParams = { postId: string }
type RequestBody = { comment?: string }
type ResponseBody = Repost | ErrorResponse

export class CreateRepostController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly createRepostUseCase: CreateRepostUseCase
  ) { }

  async handle (httpRequest: HttpRequest<RequestBody, SignatureHeader, RequestParams>): Promise<HttpResponse<ResponseBody>> {
    try {
      this.validator.validate(httpRequest)

      const { 'user-id': userId } = httpRequest.headers
      const { postId: originalPostId } = httpRequest.params
      const { comment } = httpRequest.body

      const repost = await this.createRepostUseCase.execute({ userId, originalPostId, comment })

      return created(repost)
    } catch (exception) {
      console.error(exception)
      return error(exception)
    }
  }
}
