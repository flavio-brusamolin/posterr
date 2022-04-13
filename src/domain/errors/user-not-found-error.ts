import { CustomError } from './custom-error'
import { ErrorType } from '../enums/error-type'

export class UserNotFoundError extends CustomError {
  type = ErrorType.NOT_FOUND

  constructor () {
    super('User not found')
    this.name = 'UserNotFoundError'
  }
}
