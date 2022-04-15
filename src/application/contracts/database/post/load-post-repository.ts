import { Post } from '../../../../domain/aggregates/post'

export interface LoadPostRepository {
  loadPost: (postId: string) => Promise<Post>
}
