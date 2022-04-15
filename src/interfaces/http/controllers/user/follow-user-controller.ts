import { FollowUserUseCase } from '../../../../domain/use-cases/user/follow-user-use-case'
import { HttpRequest, HttpResponse, SignatureHeader } from '../../contracts'
import { Controller } from '../controller'
import { noContent, error } from '../../helpers/http-response-builder'

type RequestParams = { userId: string }

export class FollowUserController implements Controller {
  constructor (private readonly followUserUseCase: FollowUserUseCase) { }

  async handle ({ headers, params }: HttpRequest<any, SignatureHeader, RequestParams>): Promise<HttpResponse> {
    try {
      const { 'user-id': userId } = headers
      const { userId: targetUserId } = params

      await this.followUserUseCase.execute({ userId, targetUserId })

      return noContent()
    } catch (exception) {
      console.error(exception)
      return error(exception)
    }
  }
}
