import { BaseContext } from 'koa'
// import AccountUtilities from './account'

export default class AccountController {
  public static async requestReset (ctx: BaseContext) {
    const { email } = ctx.request.body
    ctx.assert(email, 400)
    // TODO see if email address is in DB, if not: bail
    // const resetToken = await AccountUtilities.generateResetToken()
    // const verifierHash = await AccountUtilities.getVerifierHash(resetToken)
    // await AccountUtilities.storeResetToken(resetToken.selector, verifierHash)
    // const emailToken = await AccountUtilities.getEmailResetToken(resetToken)
    // // TODO email token to user

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
}
