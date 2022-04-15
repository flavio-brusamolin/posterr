import { User } from '../../entities/user'
import { UseCase } from '../use-case'
import { ClassData } from '../../helpers/class-data'

export interface LoadUserInput {
  userId: string
  targetUserId: string
}

export interface SerializedUser extends ClassData<User> {
  followingNow: boolean
}

export type LoadUserUseCase = UseCase<LoadUserInput, SerializedUser>
