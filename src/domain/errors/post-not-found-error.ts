import { CustomError } from './custom-error'
import { ErrorType } from '../enums/error-type'

export class PostNotFoundError extends CustomError {
  type = ErrorType.NOT_FOUND

  constructor () {
    super('Post not found')
    this.name = 'PostNotFoundError'
  }
}
