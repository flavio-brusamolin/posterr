import { CustomError } from './custom-error'
import { ErrorType } from '../enums/error-type'

export class NonExistingAssociationError extends CustomError {
  type = ErrorType.BUSINESS

  constructor () {
    super('This user association does not exist')
    this.name = 'NonExistingAssociationError'
  }
}
