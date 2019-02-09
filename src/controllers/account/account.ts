import sodium from 'sodium-native'
import {CreateAccountBody, UserAccount} from '../../@types/account'
const sqlModels = require('../../models')

interface ResetToken {
  selector: Buffer
  verifier: Buffer
}

export const generateResetToken = async (): Promise<ResetToken> => {
  // generate 16 random bytes as the selector
  // generate 16 random bytes as the verifier - hash it
  const random = Buffer.alloc(32)
  sodium.randombytes_buf(random)
  const selector = random.slice(0, 16)
  const verifier = random.slice(16)
  return { selector, verifier }
}

export const getEmailResetToken = async (input: ResetToken): Promise<string> => {
  return Buffer.concat([input.selector, input.verifier]).toString('base64')
}

export const getVerifierHash = async (input: ResetToken): Promise<Buffer> => {
  const verifierHash = Buffer.alloc(sodium.crypto_generichash_BYTES)
  sodium.crypto_generichash(verifierHash, input.verifier)
  return verifierHash
}

// public static async storeResetToken (selector: Buffer, verifierHash: Buffer) {
//   // TODO store selector in DB along with hash(verifier)
// }

export const splitSelectorVerifier = async (token: string): Promise<ResetToken> => {
  const tokenBuf = Buffer.from(token, 'base64')
  const selector = tokenBuf.slice(0, 16)
  const verifier = tokenBuf.slice(16)
  return { selector, verifier }
}

// public static async deleteSelector (resetToken: ResetToken) {
//   // TODO delete resetToken.selector from DB
// }

// public static async getStoredVerifierHash (resetToken: ResetToken): Promise<Buffer> {
//   // TODO lookup resetToken.selector in DB and return stored verifier hash
//   return Buffer.alloc(0)
// }

export const compareHashes = async (a: Buffer, b: Buffer): Promise<boolean> => {
  if (a.length !== b.length) return false
  return sodium.sodium_memcmp(a, b)
}

export const createNewAccount = async (body: CreateAccountBody): Promise<UserAccount> => {
  try {
    return sqlModels.Account.create(body)
  } catch (e) {
    return Promise.reject(e)
  }
}

