import { CustomError } from './custom-error'
import { ErrorType } from '../enums/error-type'

export class FollowYourselfError extends CustomError {
  type = ErrorType.BUSINESS

  constructor () {
    super('You can\'t follow yourself')
    this.name = 'FollowYourselfError'
  }
}
