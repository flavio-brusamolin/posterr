import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeCreateRegularPostController } from '../factories/controllers/post/create-regular-post-controller-factory'
import { makeCreateRepostController } from '../factories/controllers/post/create-repost-controller-factory'
import { makeLoadPostsController } from '../factories/controllers/post/load-posts-controller-factory'

export default (router: Router): void => {
  router.post('/posts', adaptRoute(makeCreateRegularPostController()))
  router.post('/posts/:postId/repost', adaptRoute(makeCreateRepostController()))
  router.get('/posts', adaptRoute(makeLoadPostsController()))
}
