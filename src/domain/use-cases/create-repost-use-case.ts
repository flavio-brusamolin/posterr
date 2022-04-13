import { Repost } from '../entities/Repost'
import { UseCase } from './use-case'

export interface CreateRepostInput {
  userId: string
  originalPostId: string
  comment?: string
}

export type CreateRepostUseCase = UseCase<CreateRepostInput, Repost>
