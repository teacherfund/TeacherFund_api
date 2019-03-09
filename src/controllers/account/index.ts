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

  public static async requestReset (ctx: BaseContext) {
    const { email, role } = ctx.request.body
    ctx.assert(email, 400)
    // TODO see if email address is in DB, if not: bail
    
    // If exists then push through generate and store token flow
    const emailToken = await this.generateAndStoreToken(ctx)
    Methods.sendResetEmail(emailToken)

    ctx.status = 200
    ctx.body = { ok: true }
  }

  public static async receiveReset (ctx: BaseContext) {
    const { token } = ctx.request.body
    ctx.assert(token, 400)
    // const resetToken = await AccountUtilities.splitSelectorVerifier(token)
    // DB lookup first 16 bytes provided (selector)
    // if found, hash next 16 bytes provided (verifier)
    // const verifierHash = await AccountUtilities.getVerifierHash(resetToken)
    // compare hash with verifier hash in DB
    try {
      // const storedVerifierHash = await AccountUtilities.getStoredVerifierHash(resetToken)
      // const match = await AccountUtilities.compareHashes(storedVerifierHash, verifierHash)
      // if (!match) {
      //   // if hash does not match, 401 and delete token
      //   await AccountUtilities.deleteSelector(resetToken)
      //   ctx.assert(match, 401)
      // }
    } catch (e) {
      ctx.throw(401)
    }

    // if match and hasn't expired, reset the password
    return AccountController.resetPassword(ctx)
  }

  public static async resetPassword (ctx: BaseContext) {
    ctx.status = 200
    ctx.body = { ok: true }
  }

  // Endpoint to create hash to send in email to the user
  public static async register (ctx: BaseContext) {
    const { email, role } = ctx.request.body
    ctx.assert(email, 400, Strings.EmailIsRequired)
    ctx.assert(role, 400, Strings.RoleIsRequired)

    // Generate token, store it
    const emailToken = await this.generateAndStoreToken(ctx)
    Methods.sendRegisterEmail(emailToken)

    ctx.status = 200
    ctx.body = { ok: true }
  }

  // Endpoint to verify hash from email magic link and send back auth token
  public static async verifyRegister (ctx: BaseContext) {

  }
}
