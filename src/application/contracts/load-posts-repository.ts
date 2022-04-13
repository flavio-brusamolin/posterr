import { Post } from '../../domain/aggregates/post'

export interface LoadPostsRepository {
  loadPosts: (userIds?: string[]) => Promise<Post[]>
}
