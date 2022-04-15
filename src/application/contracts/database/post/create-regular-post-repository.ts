import { RegularPost } from '../../../../domain/entities/regular-post'

export interface CreateRegularPostRepository {
  createRegularPost: (regularPost: RegularPost) => Promise<RegularPost>
}
