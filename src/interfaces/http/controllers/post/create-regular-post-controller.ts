import { RegularPost } from '../../../../domain/entities/regular-post'
import { CreateRegularPostUseCase } from '../../../../domain/use-cases/post/create-regular-post-use-case'
import { Controller } from '../controller'
import { ErrorResponse, HttpRequest, HttpResponse, SignatureHeader, Validator } from '../../contracts'
import { created, error } from '../../helpers/http-response-builder'

type RequestBody = { content: string }
type ResponseBody = RegularPost | ErrorResponse

export class CreateRegularPostController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly createRegularPostUseCase: CreateRegularPostUseCase
  ) { }

  async handle (httpRequest: HttpRequest<RequestBody, SignatureHeader>): Promise<HttpResponse<ResponseBody>> {
    try {
      this.validator.validate(httpRequest)

      const { 'user-id': userId } = httpRequest.headers
      const { content } = httpRequest.body

      const regularPost = await this.createRegularPostUseCase.execute({ userId, content })

      return created(regularPost)
    } catch (exception) {
      console.error(exception)
      return error(exception)
    }
  }
}
