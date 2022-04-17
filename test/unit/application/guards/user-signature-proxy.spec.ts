import { LoadUserRepository } from '../../../../src/application/contracts/database/user/load-user-repository'
import { UserSignatureProxy } from '../../../../src/application/guards/user-signature-proxy'
import { User } from '../../../../src/domain/entities/user'
import { UserNotRegisteredError } from '../../../../src/domain/errors'
import { UseCase } from '../../../../src/domain/use-cases/use-case'
import { generateUserInput } from '../../../support/models'

const makeFakeInput = () => ({
  userId: 'any_user_id',
  any_field: 'any_field_value'
})

const makeLoadUserRepository = (): LoadUserRepository => {
  class LoadUserRepositoryStub implements LoadUserRepository {
    async loadUser (_userId: string): Promise<User> {
      return new User(generateUserInput())
    }
  }

  return new LoadUserRepositoryStub()
}

const makeUseCase = (): UseCase => {
  class UseCaseStub implements UseCase {
    async execute (_input: any): Promise<any> {
      return 'any_value'
    }
  }

  return new UseCaseStub()
}

interface SutTypes {
  userSignatureProxy: UserSignatureProxy
  loadUserRepositoryStub: LoadUserRepository
  useCaseStub: UseCase
}

const makeSut = (): SutTypes => {
  const loadUserRepositoryStub = makeLoadUserRepository()
  const useCaseStub = makeUseCase()

  const userSignatureProxy = new UserSignatureProxy(loadUserRepositoryStub, useCaseStub)

  return {
    userSignatureProxy,
    loadUserRepositoryStub,
    useCaseStub
  }
}

describe('UserSignatureProxy', () => {
  describe('#execute', () => {
    it('should call LoadUserRepository with correct values', async () => {
      const { userSignatureProxy, loadUserRepositoryStub } = makeSut()
      const loadUserSpy = jest.spyOn(loadUserRepositoryStub, 'loadUser')

      const input = makeFakeInput()
      await userSignatureProxy.execute(input)

      expect(loadUserSpy).toHaveBeenCalledWith(input.userId)
    })

    it('should throw a user not registered error when the user does not exist', async () => {
      const { userSignatureProxy, loadUserRepositoryStub } = makeSut()
      jest.spyOn(loadUserRepositoryStub, 'loadUser').mockResolvedValueOnce(null)

      const input = makeFakeInput()
      const promise = userSignatureProxy.execute(input)

      const error = new UserNotRegisteredError()
      await expect(promise).rejects.toThrow(error)
    })

    it('should call UseCase with correct values', async () => {
      const { userSignatureProxy, useCaseStub } = makeSut()
      const executeSpy = jest.spyOn(useCaseStub, 'execute')

      const input = makeFakeInput()
      await userSignatureProxy.execute(input)

      expect(executeSpy).toHaveBeenCalledWith(input)
    })

    it('should return the UseCase output', async () => {
      const { userSignatureProxy } = makeSut()

      const input = makeFakeInput()
      const output = await userSignatureProxy.execute(input)

      expect(output).toEqual('any_value')
    })
  })
})
