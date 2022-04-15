import { UnfollowUserUseCase } from '../../../../domain/use-cases/user/unfollow-user-use-case'
import { HttpRequest, HttpResponse, SignatureHeader } from '../../contracts'
import { Controller } from '../controller'
import { noContent, error } from '../../helpers/http-response-builder'

type RequestParams = { userId: string }

export class UnfollowUserController implements Controller {
  constructor (private readonly unfollowUserUseCase: UnfollowUserUseCase) { }

  async handle ({ headers, params }: HttpRequest<any, SignatureHeader, RequestParams>): Promise<HttpResponse> {
    try {
      const { 'user-id': userId } = headers
      const { userId: targetUserId } = params

      await this.unfollowUserUseCase.execute({ userId, targetUserId })

      return noContent()
    } catch (exception) {
      console.error(exception)
      return error(exception)
    }
  }
}
