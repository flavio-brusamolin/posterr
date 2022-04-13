import { CustomError } from './custom-error'
import { ErrorType } from '../enums/error-type'

export class UserNotRegisteredError extends CustomError {
  type = ErrorType.AUTHENTICATION

  constructor () {
    super('You are not a registered user')
    this.name = 'UserNotRegisteredError'
  }
}
