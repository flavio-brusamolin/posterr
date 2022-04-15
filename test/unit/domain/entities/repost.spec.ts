import { Repost } from '../../../../src/domain/entities/repost'
import { PostType } from '../../../../src/domain/enums/post-type'
import { generateRepostInput, generateRequiredRepostInput } from '../../../support/models'

describe('Repost', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern').setSystemTime(new Date())
  })

  describe('#constructor', () => {
    it('should initialize all attributes correctly when all fields are sent', () => {
      const repostInput = generateRepostInput()
      const repost = new Repost(repostInput)

      expect(repost).toEqual(repostInput)
    })

    it('should initialize all attributes correctly when only required fields are sent', () => {
      const requiredRepostInput = generateRequiredRepostInput()
      const repost = new Repost(requiredRepostInput)

      expect(repost).toEqual({
        ...requiredRepostInput,
        type: PostType.REPOST,
        createdAt: new Date()
      })
    })
  })

  describe('#getUserId', () => {
    it('should return the user id', () => {
      const repostInput = generateRepostInput()
      const repost = new Repost(repostInput)

      expect(repost.getUserId()).toEqual(repostInput.userId)
    })
  })
})
