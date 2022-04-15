import { RegularPostInput } from '../../../src/domain/entities/regular-post'
import { PostType } from '../../../src/domain/enums/post-type'
import { UUIDAdapter } from '../../../src/infrastructure/support/uuid/uuid-adapter'

const uuidAdapter = new UUIDAdapter()

export const generateRegularPostInput = (): RegularPostInput => ({
  type: PostType.REGULAR_POST,
  postId: uuidAdapter.generateId(),
  userId: uuidAdapter.generateId(),
  createdAt: new Date(),
  content: 'any_content'
})

export const generateRequiredRegularPostInput = (): RegularPostInput => {
  const regularPostInput = generateRegularPostInput()

  return {
    postId: regularPostInput.postId,
    userId: regularPostInput.userId,
    content: regularPostInput.content
  }
}
