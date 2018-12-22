import { BaseContext } from 'koa'
import sodium from 'sodium-native'

export default {
  requestReset: async (ctx: BaseContext) => {
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
    // TODO email token to user
    ctx.status = 200
    // returning these for now but not in the future
    ctx.body = {
      selector,
      verifier,
      verifierHash,
      token
    }
  },
  receiveReset: async (ctx: BaseContext) => {
    // DB lookup first 16 bytes provided (selector)
    // if found, hash next 16 bytes provided (verifier)
    // compare hash with verifier hash in DB
    // if not found 401
    // if hash does not match, 401 and delete token

    // if match and hasn't expired, reset the password
    ctx.status = 200
  }
}
