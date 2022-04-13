import { UseCase } from './use-case'

export interface UnfollowUserInput {
  userId: string
  targetUserId: string
}

export type UnfollowUserUseCase = UseCase<UnfollowUserInput, void>
