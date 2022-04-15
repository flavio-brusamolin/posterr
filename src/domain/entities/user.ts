import { Post } from '../aggregates/post'
import { AlphanumError } from '../errors/alphanum-error'
import { ExistingAssociationError } from '../errors/existing-association-error'
import { FollowYourselfError } from '../errors/follow-yourself-error'
import { MaxLengthError } from '../errors/max-length-error'
import { NonExistingAssociationError } from '../errors/non-existing-association-error'

interface UserInput {
  userId: string
  username: string
  joinedAt?: Date
  followers?: string[]
  following?: string[]
  numberOfFollowers?: number
  numberOfFollowing?: number
  numberOfPosts?: number
  postHistory?: Post[]
}

export class User {
  private userId: string
  private username: string
  private joinedAt: Date
  private followers: string[]
  private following: string[]
  private numberOfFollowers: number
  private numberOfFollowing: number
  private numberOfPosts: number
  private postHistory: Post[]

  constructor ({ userId, username, joinedAt, followers, following, numberOfFollowers, numberOfFollowing, numberOfPosts, postHistory }: UserInput) {
    this.setUserId(userId)
    this.setUsername(username)
    this.setJoinedAt(joinedAt)
    this.setFollowers(followers)
    this.setFollowing(following)
    this.setNumberOfFollowers(numberOfFollowers)
    this.setNumberOfFollowing(numberOfFollowing)
    this.setNumberOfPosts(numberOfPosts)
    this.setPostHistory(postHistory)
  }

  private setUserId (userId: string): void {
    this.userId = userId
  }

  private setUsername (username: string): void {
    const MAX_LENGTH = 14
    if (username.length > MAX_LENGTH) {
      throw new MaxLengthError('username', MAX_LENGTH)
    }

    const ALPHANUM_REGEX = /^[a-z0-9]+$/i
    if (!username.match(ALPHANUM_REGEX)) {
      throw new AlphanumError('username')
    }

    this.username = username
  }

  private setJoinedAt (joinedAt?: Date): void {
    this.joinedAt = joinedAt ?? new Date()
  }

  private setFollowers (followers?: string[]): void {
    this.followers = followers ?? []
  }

  private setFollowing (following?: string[]): void {
    this.following = following ?? []
  }

  private setNumberOfFollowers (numberOfFollowers?: number): void {
    this.numberOfFollowers = numberOfFollowers ?? 0
  }

  private setNumberOfFollowing (numberOfFollowing?: number): void {
    this.numberOfFollowing = numberOfFollowing ?? 0
  }

  private setNumberOfPosts (numberOfPosts?: number): void {
    this.numberOfPosts = numberOfPosts ?? 0
  }

  private setPostHistory (postHistory?: Post[]): void {
    this.postHistory = postHistory ?? []
  }

  private addFollowing (userId: string): void {
    if (this.following.includes(userId)) {
      throw new ExistingAssociationError()
    }

    this.following.push(userId)
    this.numberOfFollowing++
  }

  private removeFollowing (userId: string): void {
    if (!this.following.includes(userId)) {
      throw new NonExistingAssociationError()
    }

    this.following = this.following.filter(followingId => followingId !== userId)
    this.numberOfFollowing--
  }

  private addFollower (userId: string): void {
    if (this.followers.includes(userId)) {
      throw new ExistingAssociationError()
    }

    this.followers.push(userId)
    this.numberOfFollowers++
  }

  private removeFollower (userId: string): void {
    if (!this.followers.includes(userId)) {
      throw new NonExistingAssociationError()
    }

    this.followers = this.followers.filter(followerId => followerId !== userId)
    this.numberOfFollowers--
  }

  follow (user: User): void {
    if (user.userId === this.userId) {
      throw new FollowYourselfError()
    }

    this.addFollowing(user.userId)
    user.addFollower(this.userId)
  }

  unfollow (user: User): void {
    this.removeFollowing(user.userId)
    user.removeFollower(this.userId)
  }

  updatePostHistory (post: Post): void {
    const MAX_HISTORY_SIZE = 5
    if (this.postHistory.length === MAX_HISTORY_SIZE) {
      this.postHistory.pop()
    }

    this.postHistory.unshift(post)
    this.numberOfPosts++
  }

  isFollowedBy (userId: string): boolean {
    return this.followers.includes(userId)
  }

  getUserId (): string {
    return this.userId
  }

  getFollowing (): string[] {
    return this.following
  }
}
