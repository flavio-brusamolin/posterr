import { CustomError } from './custom-error'
import { ErrorType } from '../enums/error-type'

export class AlphanumError extends CustomError {
  type = ErrorType.CONTRACT

  constructor (param: string) {
    super(`Only alphanumeric characters can be used for ${param} parameter`)
    this.name = 'AlphanumError'
  }
}
