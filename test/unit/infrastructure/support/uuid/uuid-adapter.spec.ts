import { UUIDAdapter } from '../../../../../src/infrastructure/support/uuid/uuid-adapter'
import uuid from 'uuid'

jest.mock('uuid', () => ({
  v4: () => 'any_uuid'
}))

const makeSut = () => new UUIDAdapter()

describe('UUIDAdapter', () => {
  describe('#generateId', () => {
    it('should call uuid v4', () => {
      const uuidAdapter = makeSut()
      const v4Spy = jest.spyOn(uuid, 'v4')

      uuidAdapter.generateId()

      expect(v4Spy).toHaveBeenCalled()
    })

    it('should return the generated value', () => {
      const uuidAdapter = makeSut()

      const id = uuidAdapter.generateId()

      expect(id).toBe('any_uuid')
    })
  })
})
