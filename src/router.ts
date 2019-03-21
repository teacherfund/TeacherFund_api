import Router from 'koa-router'
import * as controllers from './controllers'

const router = new Router()

// General routes
router.get('/alive', controllers.general.alive)

/* Account routes */
// send magic link to email for login flow
router.post('/account/login', controllers.account.login)
// send magic link to user email for register flow
router.post('/account/register', controllers.account.register)
// receive magic link request to register or login redirect to home page auth'd
router.post('/account/verify', controllers.account.verifyAuth)

/* Teacher routes */
router.post('/donate', controllers.donation.createDonation)

// subscribe
router.post('/subscribe', controllers.user.createUser)


export default router
