import { CustomError } from './custom-error'
import { ErrorType } from '../enums/error-type'

export class PostLimitError extends CustomError {
  type = ErrorType.BUSINESS

  constructor () {
    super('You reached the post limit per day')
    this.name = 'PostLimitError'
  }
}
