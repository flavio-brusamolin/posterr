import { RegularPost } from '../../../../src/domain/entities/regular-post'
import { User } from '../../../../src/domain/entities/user'
import { AlphanumError, ExistingAssociationError, FollowYourselfError, MaxLengthError, NonExistingAssociationError } from '../../../../src/domain/errors'
import { generateUserInput, generateRequiredUserInput, generateRegularPostInput } from '../../../support/models'

const generateString = (length: number): string => 'x'.repeat(length)

describe('User', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern').setSystemTime(new Date())
  })

  describe('#constructor', () => {
    it('should initialize all attributes correctly when all fields are sent', () => {
      const userInput = generateUserInput()
      const user = new User(userInput)

      expect(user).toEqual(userInput)
    })

    it('should initialize all attributes correctly when only required fields are sent', () => {
      const requiredUserInput = generateRequiredUserInput()
      const user = new User(requiredUserInput)

      expect(user).toEqual({
        ...requiredUserInput,
        joinedAt: new Date(),
        followers: [],
        following: [],
        numberOfFollowers: 0,
        numberOfFollowing: 0,
        numberOfPosts: 0,
        postHistory: []
      })
    })

    it('should throw a max length error when username is greater than 14 characters', () => {
      const MAX_LENGTH = 14
      const wrongUserInput = {
        ...generateUserInput(),
        username: generateString(MAX_LENGTH + 1)
      }

      const error = new MaxLengthError('username', MAX_LENGTH)
      expect(() => new User(wrongUserInput)).toThrow(error)
    })

    it('should throw a alphanum error when username is not a alphanumeric string', () => {
      const wrongUserInput = {
        ...generateUserInput(),
        username: '$username!'
      }

      const error = new AlphanumError('username')
      expect(() => new User(wrongUserInput)).toThrow(error)
    })
  })

  describe('#getUserId', () => {
    it('should return the user id', () => {
      const userInput = generateUserInput()
      const user = new User(userInput)

      expect(user.getUserId()).toEqual(userInput.userId)
    })
  })

  describe('#getFollowers', () => {
    it('should return the followers array', () => {
      const userInput = generateUserInput()
      const user = new User(userInput)

      expect(user.getFollowers()).toEqual(userInput.followers)
    })
  })

  describe('#getFollowing', () => {
    it('should return the following array', () => {
      const userInput = generateUserInput()
      const user = new User(userInput)

      expect(user.getFollowing()).toEqual(userInput.following)
    })
  })

  describe('#getNumberOfFollowers', () => {
    it('should return the number of followers', () => {
      const userInput = generateUserInput()
      const user = new User(userInput)

      expect(user.getNumberOfFollowers()).toEqual(userInput.numberOfFollowers)
    })
  })

  describe('#getNumberOfFollowing', () => {
    it('should return the number of following', () => {
      const userInput = generateUserInput()
      const user = new User(userInput)

      expect(user.getNumberOfFollowing()).toEqual(userInput.numberOfFollowing)
    })
  })

  describe('#getNumberOfPosts', () => {
    it('should return the number of posts', () => {
      const userInput = generateUserInput()
      const user = new User(userInput)

      expect(user.getNumberOfPosts()).toEqual(userInput.numberOfPosts)
    })
  })

  describe('#getPostHistory', () => {
    it('should return the post history', () => {
      const userInput = generateUserInput()
      const user = new User(userInput)

      expect(user.getPostHistory()).toEqual(userInput.postHistory)
    })
  })

  describe('#follow', () => {
    it('should throw a follow yourself error when the user to follow is the entity itself', () => {
      const userInput = generateUserInput()
      const user = new User(userInput)
      const targetUser = new User(userInput)

      const error = new FollowYourselfError()
      expect(() => user.follow(targetUser)).toThrow(error)
    })

    it('should throw a existing association error when the user to follow is already followed', () => {
      const user = new User(generateUserInput())
      const targetUser = new User(generateUserInput())

      user.follow(targetUser)

      const error = new ExistingAssociationError()
      expect(() => user.follow(targetUser)).toThrow(error)
    })

    it('should update the user attributes when this association is performed', () => {
      const user = new User(generateUserInput())
      const targetUser = new User(generateUserInput())

      user.follow(targetUser)

      expect(user.getFollowing()).toEqual([targetUser.getUserId()])
      expect(user.getNumberOfFollowing()).toBe(1)
      expect(targetUser.getFollowers()).toEqual([user.getUserId()])
      expect(targetUser.getNumberOfFollowers()).toBe(1)
    })
  })

  describe('#unfollow', () => {
    it('should throw a non existing association error when the user to unfollow is not followed yet', () => {
      const user = new User(generateUserInput())
      const targetUser = new User(generateUserInput())

      const error = new NonExistingAssociationError()
      expect(() => user.unfollow(targetUser)).toThrow(error)
    })

    it('should update the user attributes when this association is reversed', () => {
      const user = new User(generateUserInput())
      const targetUser = new User(generateUserInput())

      user.follow(targetUser)

      expect(user.getFollowing()).toEqual([targetUser.getUserId()])
      expect(user.getNumberOfFollowing()).toBe(1)
      expect(targetUser.getFollowers()).toEqual([user.getUserId()])
      expect(targetUser.getNumberOfFollowers()).toBe(1)

      user.unfollow(targetUser)

      expect(user.getFollowing()).toEqual([])
      expect(user.getNumberOfFollowing()).toBe(0)
      expect(targetUser.getFollowers()).toEqual([])
      expect(targetUser.getNumberOfFollowers()).toBe(0)
    })
  })

  describe('#isFollowedBy', () => {
    it('should return true when the received id belongs to a user follower', () => {
      const user = new User(generateUserInput())
      const targetUser = new User(generateUserInput())

      user.follow(targetUser)

      expect(targetUser.isFollowedBy(user.getUserId())).toBeTruthy()
    })

    it('should return false when the received id does not belong to a user follower', () => {
      const user = new User(generateUserInput())
      const targetUser = new User(generateUserInput())

      user.follow(targetUser)
      user.unfollow(targetUser)

      expect(targetUser.isFollowedBy(user.getUserId())).toBeFalsy()
    })
  })

  describe('#updatePostHistory', () => {
    it('should add the new post to the beginning of history and remove the oldest post when the size limit is reached', () => {
      const user = new User(generateUserInput())

      const firstPost = new RegularPost(generateRegularPostInput())
      const middlePost = new RegularPost(generateRegularPostInput())
      const lastPost = new RegularPost(generateRegularPostInput())

      user.updatePostHistory(firstPost)
      user.updatePostHistory(middlePost)
      user.updatePostHistory(middlePost)
      user.updatePostHistory(middlePost)
      user.updatePostHistory(middlePost)

      expect(user.getPostHistory()).toEqual([middlePost, middlePost, middlePost, middlePost, firstPost])
      expect(user.getNumberOfPosts()).toBe(5)

      user.updatePostHistory(lastPost)

      expect(user.getPostHistory()).toEqual([lastPost, middlePost, middlePost, middlePost, middlePost])
      expect(user.getNumberOfPosts()).toBe(6)
    })
  })
})
