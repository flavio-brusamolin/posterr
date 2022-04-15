import { RegularPost } from '../../entities/regular-post'
import { UseCase } from '../use-case'

export interface CreateRegularPostInput {
  userId: string
  content: string
}

export type CreateRegularPostUseCase = UseCase<CreateRegularPostInput, RegularPost>
