import { BaseContext } from 'koa'
import * as Strings from '../../helpers/strings'
import * as Methods from '../../helpers/methods'
import {
  generateAuthToken,
  storeAuthToken,
  getVerifierHash,
  getEmailAuthToken,
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
    // TODO look up hash sent in request in the db and email address
    // and make sure they match. if so then respond success and FE
    // will redirect to account page. if fail the FE will redirect to home page
    // and show prompt

    ctx.status = 200
    ctx.body = { ok: true }
  }
}
