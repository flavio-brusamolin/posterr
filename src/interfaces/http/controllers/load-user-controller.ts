import { LoadUserUseCase, SerializedUser } from '../../../domain/use-cases/load-user-use-case'
import { ErrorResponse } from '../contracts/error-response'
import { HttpRequest } from '../contracts/http-request'
import { HttpResponse } from '../contracts/http-response'
import { SignatureHeader } from '../contracts/signature-header'
import { Controller } from './controller'
import { ok, error } from '../helpers/http-response-builder'

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
