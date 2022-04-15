import { RegularPost } from '../../../../src/domain/entities/regular-post'
import { PostType } from '../../../../src/domain/enums/post-type'
import { MaxLengthError } from '../../../../src/domain/errors'
import { generateRegularPostInput, generateRequiredRegularPostInput } from '../../../support/models'

const generateString = (length: number): string => 'x'.repeat(length)

describe('RegularPost', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern').setSystemTime(new Date())
  })

  describe('#constructor', () => {
    it('should initialize all attributes correctly when all fields are sent', () => {
      const regularPostInput = generateRegularPostInput()
      const regularPost = new RegularPost(regularPostInput)

      expect(regularPost).toEqual(regularPostInput)
    })

    it('should initialize all attributes correctly when only required fields are sent', () => {
      const requiredRegularPostInput = generateRequiredRegularPostInput()
      const regularPost = new RegularPost(requiredRegularPostInput)

      expect(regularPost).toEqual({
        ...requiredRegularPostInput,
        type: PostType.REGULAR_POST,
        createdAt: new Date()
      })
    })

    it('should throw a max length error when content is greater than 777 characters', () => {
      const MAX_LENGTH = 777
      const wrongRegularPostInput = {
        ...generateRegularPostInput(),
        content: generateString(MAX_LENGTH + 1)
      }

      const error = new MaxLengthError('content', MAX_LENGTH)
      expect(() => new RegularPost(wrongRegularPostInput)).toThrow(error)
    })
  })

  describe('#getUserId', () => {
    it('should return the user id', () => {
      const regularPostInput = generateRegularPostInput()
      const regularPost = new RegularPost(regularPostInput)

      expect(regularPost.getUserId()).toEqual(regularPostInput.userId)
    })
  })
})
