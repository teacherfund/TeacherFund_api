import { BaseContext } from 'koa'
import * as Strings from '../../helpers/strings'
import * as Methods from '../../helpers/methods'
import {
  generateAuthToken,
  storeAuthToken,
  getVerifierHash,
  getEmailAuthToken,
  getStoredVerifierHash,
} from './account'

export default class AccountController {
  // Abstract function to generate and store token and return for emailing
  public static async generateAndStoreToken(ctx: BaseContext): Promise<string> {
    const { email, role } = ctx.request.body
    // Create activation token
    const token = await generateAuthToken()

    // Get verifier hash
    const verifierHash = await getVerifierHash(token)

    // Store json blob of request in dynamo db with key of activation token
    await storeAuthToken(email, role, token.selector, verifierHash)

    // Send magic link via sendgrid helper service
    const emailToken = await getEmailAuthToken(token)
    return emailToken
  }

  // Endpoint to create hash to send in email to the user on login
  public static async login (ctx: BaseContext) {
    const { email } = ctx.request.body
    ctx.assert(email, 400, Strings.EmailIsRequired)

    // Generate token, store it
    const emailToken = await this.generateAndStoreToken(ctx)
    try {
      Methods.sendMagicLinkEmail(email, emailToken)
      ctx.body = { ok: true }
    } catch (e) {
      ctx.body = { ok: false }
    }
  }

  // Endpoint to create hash to send in email to the user on register
  public static async register (ctx: BaseContext) {
    const { email, role } = ctx.request.body
    ctx.assert(email, 400, Strings.EmailIsRequired)
    ctx.assert(role, 400, Strings.RoleIsRequired)

    // Generate token, store it
    const emailToken = await this.generateAndStoreToken(ctx)
    try {
      Methods.sendMagicLinkEmail(email, emailToken)
      ctx.body = { ok: true }
    } catch (e) {
      ctx.body = { ok: false }
    }
  }

  // Endpoint to verify hash from email magic link and send back auth token
  public static async verifyAuth (ctx: BaseContext) {
    const { email, auth } = ctx.request.body
    ctx.assert(email, 400, Strings.EmailIsRequired)
    ctx.assert(auth, 400, Strings.AuthIsRequired)

    // Look up hash sent in request in the db 
    try {
      const token = await getStoredVerifierHash(ctx.request.body.auth)
      // If email matches the tokens email, they're authd and we should replace 
      // token with long lasting token and respond with that token + an ok status
      if (token.email === email) {
        
        ctx.status = 200
        ctx.body = { ok: true }
      }
    } catch (e) {
      ctx.status = 200
      ctx.body = { ok: false }
    }
  }
}
