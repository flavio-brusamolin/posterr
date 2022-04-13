import { CustomError } from './custom-error'
import { ErrorType } from '../enums/error-type'

export class MaxLengthError extends CustomError {
  type = ErrorType.CONTRACT

  constructor (param: string, length: number) {
    super(`The ${param} parameter cannot be longer than ${length} characters`)
    this.name = 'MaxLengthError'
  }
}
