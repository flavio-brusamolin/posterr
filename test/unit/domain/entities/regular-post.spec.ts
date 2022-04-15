import { RegularPost } from '../../../../src/domain/entities/regular-post'
import { PostType } from '../../../../src/domain/enums/post-type'
import { MaxLengthError } from '../../../../src/domain/errors'

const generateString = (length: number) => 'x'.repeat(length)

describe('RegularPost', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern').setSystemTime(new Date())
  })

  describe('#constructor', () => {
    it('should initialize all attributes correctly when all fields are sent', () => {
      const regularPostInput = {
        type: PostType.REGULAR_POST,
        postId: 'any_post_id',
        userId: 'any_user_id',
        createdAt: new Date(),
        content: 'any_content'
      }

      const regularPost = new RegularPost(regularPostInput)

      expect(regularPost).toEqual(regularPostInput)
    })

    it('should initialize all attributes correctly when only required fields are sent', () => {
      const regularPostInput = {
        postId: 'any_post_id',
        userId: 'any_user_id',
        content: 'any_content'
      }

      const regularPost = new RegularPost(regularPostInput)

      expect(regularPost).toEqual({
        ...regularPostInput,
        type: PostType.REGULAR_POST,
        createdAt: new Date()
      })
    })

    it('should throw a max length error when content is greater than 777 characters', () => {
      const MAX_LENGTH = 777
      const regularPostInput = {
        postId: 'any_post_id',
        userId: 'any_user_id',
        content: generateString(MAX_LENGTH + 1)
      }

      const error = new MaxLengthError('content', MAX_LENGTH)
      expect(() => new RegularPost(regularPostInput)).toThrow(error)
    })
  })

  describe('#getUserId', () => {
    it('should return the user id', () => {
      const regularPostInput = {
        postId: 'any_post_id',
        userId: 'any_user_id',
        content: 'any_content'
      }

      const regularPost = new RegularPost(regularPostInput)

      expect(regularPost.getUserId()).toEqual(regularPostInput.userId)
    })
  })
})
