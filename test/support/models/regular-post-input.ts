import { PostType } from '../../../src/domain/enums/post-type'

export const regularPostInput = {
  type: PostType.REGULAR_POST,
  postId: 'any_post_id',
  userId: 'any_user_id',
  createdAt: new Date(),
  content: 'any_content'
}

export const requiredRegularPostInput = {
  postId: regularPostInput.postId,
  userId: regularPostInput.userId,
  content: regularPostInput.content
}
