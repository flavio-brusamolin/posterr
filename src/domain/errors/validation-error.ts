import { CustomError } from './custom/custom-error'
import { ErrorType } from '../enums/error-type'

export class ValidationError extends CustomError {
  type = ErrorType.CONTRACT

  constructor (message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
