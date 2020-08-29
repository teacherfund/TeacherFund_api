import { Context } from 'koa'
import * as Strings from '../../helpers/strings'
import * as Methods from '../../helpers/methods'
import {
  getStoredSession,
  generateAndStoreToken,
  splitSelectorVerifier,
  getVerifierHash,
  deleteSelector,
  getAccount,
  createNewAccount,
  compareHashes
} from './account'

export default class AccountController {
  // Endpoint to create hash to send in email to the user on login
  public static async login (ctx: Context) {
    const { email } = ctx.request.body
    ctx.assert(email, 400, Strings.EmailIsRequired)
    
    // Lookup email in mysql db to make sure it's a registered user
    const existingAccount = await getAccount({ email })

    // If an existing account doesnt exist, the user was never registered
    // return ok: true anyways to display agnostic message that 
    // "If you have registered, you will receive an email shortly"
    if (!existingAccount) {
      return ctx.body = { ok: true }
    }

    // Generate token, store it
    const emailToken = await generateAndStoreToken({
      ctx, 
      longLiveToken: false, 
      registered: true, 
      meta: {}
    })

    try {
      await Methods.sendMagicLinkEmail(email, emailToken)
      ctx.body = { ok: true }
    } catch (e) {
      console.log(e)
      ctx.status = 400
      ctx.body = { ok: false, message: e.message || 'unknown error' }
    }
    return
  }

  // Endpoint to create hash to send in email to the user on register
  public static async register (ctx: Context) {
    const { email, role } = ctx.request.body
    ctx.assert(email, 400, Strings.EmailIsRequired)
    ctx.assert(role, 400, Strings.RoleIsRequired)

    const sessionMeta = { 
      firstName: ctx.request.body.firstName, 
      lastName: ctx.request.body.lastName 
    }
    // Generate token, store it
    const emailToken = await generateAndStoreToken({
      ctx, 
      longLiveToken: false, 
      registered: false, 
      meta: sessionMeta
    })
    try {
      await Methods.sendMagicLinkEmail(email, emailToken)
      ctx.body = { ok: true }
    } catch (e) {
      ctx.status = 400
      ctx.body = { ok: false, message: e.message || 'unkonwn error' }
    }
  }

  // Endpoint to verify hash from email magic link and send back auth token
  public static async verifyAuth (ctx: Context) {
    const { email, auth } = ctx.request.body
    ctx.assert(email, 400, Strings.EmailIsRequired)
    ctx.assert(auth, 400, Strings.AuthIsRequired)

    // Look up hash sent in request in the db 
    try {
      const authToken = await splitSelectorVerifier(auth)
      if (!authToken) return ctx.status = 401

      const sessionInfo = await getStoredSession(authToken)
      // delete the short term session
      deleteSelector(sessionInfo)

      // If expiration has passed, return unauthorized
      if (sessionInfo.expiration < Date.now()) return ctx.status = 401

      // Grab the bytes of the verifier we retrieved out of dynamo
      const sessionVerifier = Buffer.from(sessionInfo.verifierHash, 'hex')
      // Get the auth token sent down verifier hash
      const tokenVerifier = await getVerifierHash(authToken)

      // See if hashes match
      const hashesMatch = await compareHashes(sessionVerifier, tokenVerifier)
      if (!hashesMatch) return ctx.status = 401
    
      // If email matches the tokens email and the verifiers match, they're authd 
      // and we should replace token with long lasting token and respond with 
      // that token + an ok status
      if (sessionInfo.email === email) {

        // If the user isn't created yet, create one
        if (!sessionInfo.registered) {
          await createNewAccount({ email, role: sessionInfo.role, ...sessionInfo.meta })
        }

        const enrichedCtx = Object.assign({}, ctx, {
          role: sessionInfo.role
        })
        
        // Generate long live token, store it
        const longLiveToken = await generateAndStoreToken({
          ctx: enrichedCtx,
          longLiveToken: true, 
          registered: true, 
          meta: sessionInfo.meta
        })

        ctx.status = 200
        ctx.cookies.set('tfauth', longLiveToken)
        ctx.body = { ok: true }
      } else {
        ctx.status = 401
      }
    } catch (e) {
      console.log(e)
      ctx.status = 400
      ctx.body = { ok: false }
    }
    return
  }
}
