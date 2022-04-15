import { Repost } from '../../../../src/domain/entities/repost'
import { RegularPost } from '../../../../src/domain/entities/regular-post'
import { PostType } from '../../../../src/domain/enums/post-type'

describe('Repost', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern').setSystemTime(new Date())
  })

  describe('#constructor', () => {
    it('should initialize all attributes correctly when all fields are sent', () => {
      const repostInput = {
        type: PostType.REPOST,
        postId: 'any_post_id',
        userId: 'any_user_id',
        createdAt: new Date(),
        originalPost: new RegularPost({
          type: PostType.REGULAR_POST,
          postId: 'any_post_id',
          userId: 'any_user_id',
          createdAt: new Date(),
          content: 'any_content'
        }),
        comment: 'any_comment'
      }

      const repost = new Repost(repostInput)

      expect(repost).toEqual(repostInput)
    })

    it('should initialize all attributes correctly when only required fields are sent', () => {
      const repostInput = {
        postId: 'any_post_id',
        userId: 'any_user_id',
        originalPost: new RegularPost({
          type: PostType.REGULAR_POST,
          postId: 'any_post_id',
          userId: 'any_user_id',
          createdAt: new Date(),
          content: 'any_content'
        })
      }

      const repost = new Repost(repostInput)

      expect(repost).toEqual({
        ...repostInput,
        type: PostType.REPOST,
        createdAt: new Date()
      })
    })
  })

  describe('#getUserId', () => {
    it('should return the user id', () => {
      const repostInput = {
        postId: 'any_post_id',
        userId: 'any_user_id',
        originalPost: new RegularPost({
          type: PostType.REGULAR_POST,
          postId: 'any_post_id',
          userId: 'any_user_id',
          createdAt: new Date(),
          content: 'any_content'
        })
      }

      const repost = new Repost(repostInput)

      expect(repost.getUserId()).toEqual(repostInput.userId)
    })
  })
})
