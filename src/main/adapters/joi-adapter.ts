import { ObjectSchema, ValidationOptions } from 'joi'
import { ValidationError } from '../../domain/errors/validation-error'
import { Validator } from '../../interfaces/http/contracts'

export class JoiAdapter implements Validator {
  private readonly options: ValidationOptions = { allowUnknown: true }

  public constructor (private readonly contract: ObjectSchema) { }

  public validate (input: any): void {
    const { error } = this.contract.validate(input, this.options)
    if (error) {
      throw new ValidationError(error.message)
    }
  }
}
