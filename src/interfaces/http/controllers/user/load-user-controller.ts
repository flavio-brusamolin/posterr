import { LoadUserUseCase, SerializedUser } from '../../../../domain/use-cases/user/load-user-use-case'
import { ErrorResponse, HttpRequest, HttpResponse, SignatureHeader } from '../../contracts'
import { Controller } from '../controller'
import { ok, error } from '../../helpers/http-response-builder'

type RequestParams = { userId: string }
type ResponseBody = SerializedUser | ErrorResponse

export class LoadUserController implements Controller {
  constructor (private readonly loadUserUseCase: LoadUserUseCase) { }

  async handle ({ headers, params }: HttpRequest<any, SignatureHeader, RequestParams>): Promise<HttpResponse<ResponseBody>> {
    try {
      const { 'user-id': userId } = headers
      const { userId: targetUserId } = params

      const user = await this.loadUserUseCase.execute({ userId, targetUserId })

      return ok(user)
    } catch (exception) {
      console.error(exception)
      return error(exception)
    }
  }
}