import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeFollowUserController } from '../factories/controllers/follow-user-controller-factory'
import { makeLoadUserController } from '../factories/controllers/load-user-controller-factory'

export default (router: Router): void => {
  router.post('/users/:userId/follow', adaptRoute(makeFollowUserController()))
  router.get('/users/:userId', adaptRoute(makeLoadUserController()))
}
