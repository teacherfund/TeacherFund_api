import Router from 'koa-router'
import * as controllers from './controllers'

const router = new Router()

// General routes
router.get('/alive', controllers.general.alive)

/* Account routes */
// request a reset token
router.post('/account/reset/request', controllers.account.requestReset)
// use a reset token
router.post('/account/reset/receive', controllers.account.receiveReset)
// reset a password
router.post('/account/reset', controllers.account.resetPassword)

/* Teacher routes */
router.post('/donate', controllers.donation.createDonation)


export default router
