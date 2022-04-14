import { RegularPost } from '../../../domain/entities/regular-post'
import { CreateRegularPostUseCase } from '../../../domain/use-cases/create-regular-post-use-case'
import { Controller } from './controller'
import { ErrorResponse } from '../contracts/error-response'
import { HttpRequest } from '../contracts/http-request'
import { HttpResponse } from '../contracts/http-response'
import { SignatureHeader } from '../contracts/signature-header'
import { created, error } from '../helpers/http-response-builder'

type RequestBody = { content: string }
type ResponseBody = RegularPost | ErrorResponse

export class CreateRegularPostController implements Controller {
  constructor (private readonly createRegularPostUseCase: CreateRegularPostUseCase) { }

  async handle ({ body, headers }: HttpRequest<RequestBody, SignatureHeader>): Promise<HttpResponse<ResponseBody>> {
    try {
      const { 'user-id': userId } = headers
      const { content } = body

      const regularPost = await this.createRegularPostUseCase.execute({ userId, content })

      return created(regularPost)
    } catch (exception) {
      console.error(exception)
      return error(exception)
    }
  }
}
