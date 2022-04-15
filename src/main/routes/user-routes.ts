import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeFollowUserController } from '../factories/controllers/user/follow-user-controller-factory'
import { makeUnfollowUserController } from '../factories/controllers/user/unfollow-user-controller-factory'
import { makeLoadUserController } from '../factories/controllers/user/load-user-controller-factory'

export default (router: Router): void => {
  router.post('/users/:userId/follow', adaptRoute(makeFollowUserController()))
  router.post('/users/:userId/unfollow', adaptRoute(makeUnfollowUserController()))
  router.get('/users/:userId', adaptRoute(makeLoadUserController()))
}
