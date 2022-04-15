import { Repost } from '../../../../domain/entities/repost'
import { CreateRepostUseCase } from '../../../../domain/use-cases/post/create-repost-use-case'
import { Controller } from '../controller'
import { ErrorResponse, HttpRequest, HttpResponse, SignatureHeader } from '../../contracts'
import { created, error } from '../../helpers/http-response-builder'

type RequestParams = { postId: string }
type RequestBody = { comment?: string }
type ResponseBody = Repost | ErrorResponse

export class CreateRepostController implements Controller {
  constructor (private readonly createRepostUseCase: CreateRepostUseCase) { }

  async handle ({ body, headers, params }: HttpRequest<RequestBody, SignatureHeader, RequestParams>): Promise<HttpResponse<ResponseBody>> {
    try {
      const { 'user-id': userId } = headers
      const { postId: originalPostId } = params
      const { comment } = body

      const repost = await this.createRepostUseCase.execute({ userId, originalPostId, comment })

      return created(repost)
    } catch (exception) {
      console.error(exception)
      return error(exception)
    }
  }
}
