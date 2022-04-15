import { UserInput } from '../../../src/domain/entities/user'
import { UUIDAdapter } from '../../../src/infrastructure/support/uuid/uuid-adapter'

const uuidAdapter = new UUIDAdapter()

export const generateUserInput = (): UserInput => ({
  userId: uuidAdapter.generateId(),
  username: 'username',
  joinedAt: new Date(),
  followers: [],
  following: [],
  numberOfFollowers: 0,
  numberOfFollowing: 0,
  numberOfPosts: 0,
  postHistory: []
})

export const generateRequiredUserInput = (): UserInput => {
  const userInput = generateUserInput()

  return {
    userId: userInput.userId,
    username: userInput.username
  }
}
