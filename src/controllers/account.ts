import { BaseContext } from 'koa'
import sodium from 'sodium-native'

export default class AccountController {
  public static async requestReset (ctx: BaseContext) {
    const { email } = ctx.request.body
    ctx.assert(email, 400)
    // see if email address is in DB, if not: bail
    // generate 16 random bytes as the selector
    // generate 16 random bytes as the verifier - hash it
    const random = Buffer.alloc(32)
    sodium.randombytes_buf(random)
    const selector = random.slice(0, 16)
    const verifier = random.slice(16)
    const verifierHash = Buffer.alloc(sodium.crypto_generichash_BYTES)
    sodium.crypto_generichash(verifierHash, verifier)
    // TODO store selector in DB along with hash(verifier)
    const token = Buffer.concat([selector, verifierHash]).toString('base64')
    // TODO email token to user and comment out next line
    ctx.log.info({ token })
    ctx.status = 200
    ctx.body = { ok: true }
  }
  public static async receiveReset (ctx: BaseContext) {
    const { token } = ctx.request.body
    ctx.assert(token, 400)
    const tokenBuf = Buffer.from(token, 'base64')
    const selector = tokenBuf.slice(0, 16)
    const verifierHash = tokenBuf.slice(16)
    ctx.log.info({ selector })
    ctx.log.info({ verifierHash })
    // DB lookup first 16 bytes provided (selector)
    // if found, hash next 16 bytes provided (verifier)
    // compare hash with verifier hash in DB
    // if not found 401
    // if hash does not match, 401 and delete token

    // if match and hasn't expired, reset the password
    return AccountController.resetPassword(ctx)
  }
  public static async resetPassword (ctx: BaseContext) {
    ctx.status = 200
    ctx.body = { ok: true }
  }
}
