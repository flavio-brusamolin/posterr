import { IdentifierGenerator } from '../../../application/contracts/identifier-generator'
import { v4 as uuid } from 'uuid'

export class UUIDAdapter implements IdentifierGenerator {
  generateId (): string {
    return uuid()
  }
}
