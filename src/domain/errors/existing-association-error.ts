import { CustomError } from './custom-error'
import { ErrorType } from '../enums/error-type'

export class ExistingAssociationError extends CustomError {
  type = ErrorType.BUSINESS

  constructor () {
    super('This user association has already been performed')
    this.name = 'ExistingAssociationError'
  }
}
