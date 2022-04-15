import { RegularPost } from '../../../src/domain/entities/regular-post'
import { PostType } from '../../../src/domain/enums/post-type'
import { regularPostInput } from './regular-post-input'

export const repostInput = {
  type: PostType.REPOST,
  postId: 'any_post_id',
  userId: 'any_user_id',
  createdAt: new Date(),
  originalPost: new RegularPost(regularPostInput),
  comment: 'any_comment'
}

export const requiredRepostInput = {
  postId: repostInput.postId,
  userId: repostInput.userId,
  originalPost: repostInput.originalPost
}
