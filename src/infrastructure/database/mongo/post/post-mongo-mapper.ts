import { PostMongo } from './post-mongo-entity'
import { RegularPost } from '../../../../domain/entities/regular-post'
import { Repost } from '../../../../domain/entities/repost'
import { Post } from '../../../../domain/aggregates/post'
import { PostType } from '../../../../domain/enums/post-type'

export default {
  toDomainEntity: ({ type, postId, userId, createdAt, content, originalPost, comment }: PostMongo): Post => {
    if (type === PostType.REGULAR_POST) {
      return new RegularPost({
        type,
        postId,
        userId,
        createdAt,
        content
      })
    }

    if (type === PostType.REPOST) {
      return new Repost({
        type,
        postId,
        userId,
        createdAt,
        originalPost: new RegularPost(originalPost),
        comment
      })
    }
  }
}
