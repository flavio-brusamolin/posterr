import { Repost } from '../../../../domain/entities/repost'

export interface CreateRepostRepository {
  createRepost: (repost: Repost) => Promise<Repost>
}
