import { UseCase } from '../../domain/use-cases/use-case'
import { LoadUserRepository } from '../contracts/load-user-repository'
import { UserNotRegisteredError } from '../../domain/errors/user-not-registered-error'

interface UserSignatureInput {
  userId: string
}

export class UserSignatureProxy implements UseCase<UserSignatureInput, any> {
  constructor (
    private readonly loadUserRepository: LoadUserRepository,
    private readonly useCase: UseCase
  ) { }

  async execute (input: UserSignatureInput): Promise<any> {
    const { userId } = input

    const user = await this.loadUserRepository.loadUser(userId)
    if (!user) {
      throw new UserNotRegisteredError()
    }

    return await this.useCase.execute(input)
  }
}
