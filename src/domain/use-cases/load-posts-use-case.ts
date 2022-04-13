import { Post } from '../aggregates/post'
import { FromOption } from '../enums/from-option'
import { UseCase } from './use-case'

export interface LoadPostsInput {
  userId: string
  from?: FromOption
}

export type LoadPostsUseCase = UseCase<LoadPostsInput, Post[]>
