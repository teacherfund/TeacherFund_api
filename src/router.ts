import Router from 'koa-router'
import * as controllers from './controllers'

const router = new Router()

router.get('/alive', controllers.general.alive)

export default router
