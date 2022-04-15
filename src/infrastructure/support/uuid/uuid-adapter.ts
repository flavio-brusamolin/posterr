import { IdentifierGenerator } from '../../../application/contracts/support/identifier-generator'
import { v4 as uuid } from 'uuid'

export class UUIDAdapter implements IdentifierGenerator {
  generateId (): string {
    return uuid()
  }
}
