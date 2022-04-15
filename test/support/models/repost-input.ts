import { RegularPost } from '../../../src/domain/entities/regular-post'
import { PostType } from '../../../src/domain/enums/post-type'
import { generateRegularPostInput } from './regular-post-input'
import { UUIDAdapter } from '../../../src/infrastructure/support/uuid/uuid-adapter'
import { RepostInput } from '../../../src/domain/entities/repost'

const uuidAdapter = new UUIDAdapter()

export const generateRepostInput = (): RepostInput => ({
  type: PostType.REPOST,
  postId: uuidAdapter.generateId(),
  userId: uuidAdapter.generateId(),
  createdAt: new Date(),
  originalPost: new RegularPost(generateRegularPostInput()),
  comment: 'any_comment'
})

export const generateRequiredRepostInput = (): RepostInput => {
  const repostInput = generateRepostInput()

  return {
    postId: repostInput.postId,
    userId: repostInput.userId,
    originalPost: repostInput.originalPost
  }
}
