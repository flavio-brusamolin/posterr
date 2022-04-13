import { CustomError } from './custom-error'
import { ErrorType } from '../enums/error-type'

export class RepostChainError extends CustomError {
  type = ErrorType.BUSINESS

  constructor () {
    super('Only regular posts can be reposted')
    this.name = 'RepostChainError'
  }
}
