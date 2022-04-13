import { UseCase } from './use-case'

export interface FollowUserInput {
  userId: string
  targetUserId: string
}

export type FollowUserUseCase = UseCase<FollowUserInput, void>
