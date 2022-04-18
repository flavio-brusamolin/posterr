import { FollowUserUseCase } from '../../../../domain/use-cases/user/follow-user-use-case'
import { HttpRequest, HttpResponse, SignatureHeader, Validator } from '../../contracts'
import { Controller } from '../controller'
import { noContent, error } from '../../helpers/http-response-builder'

type RequestParams = { userId: string }

export class FollowUserController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly followUserUseCase: FollowUserUseCase
  ) { }

  async handle (httpRequest: HttpRequest<any, SignatureHeader, RequestParams>): Promise<HttpResponse> {
    try {
      this.validator.validate(httpRequest)

      const { 'user-id': userId } = httpRequest.headers
      const { userId: targetUserId } = httpRequest.params

      await this.followUserUseCase.execute({ userId, targetUserId })

      return noContent()
    } catch (exception) {
      console.error(exception)
      return error(exception)
    }
  }
}
