import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoadUserController } from '../factories/controllers/load-user-controller-factory'

export default (router: Router): void => {
  router.get('/users/:userId', adaptRoute(makeLoadUserController()))
}
