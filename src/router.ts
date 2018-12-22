import Router from 'koa-router'
import * as controllers from './controllers'

const router = new Router()

// General routes
router.get('/alive', controllers.general.alive)

// Account routes
router.post('/account/reset', controllers.account.requestReset)

export default router
