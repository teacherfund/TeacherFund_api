import sodium from 'sodium-native'
import {CreateAccountBody, UserAccount, GetAccountBody} from '../../@types/account'
const sqlModels = require('../../models')

interface AuthToken {
  selector: Buffer
  verifier: Buffer
}

export const generateAuthToken = async (): Promise<AuthToken> => {
  // generate 16 random bytes as the selector
  // generate 16 random bytes as the verifier - hash it
  const random = Buffer.alloc(32)
  sodium.randombytes_buf(random)
  const selector = random.slice(0, 16)
  const verifier = random.slice(16)
  return { selector, verifier }
}

export const getEmailAuthToken = async (input: AuthToken): Promise<string> => {
  return Buffer.concat([input.selector, input.verifier]).toString('base64')
}

export const getVerifierHash = async (input: AuthToken): Promise<Buffer> => {
  const verifierHash = Buffer.alloc(sodium.crypto_generichash_BYTES)
  sodium.crypto_generichash(verifierHash, input.verifier)
  return verifierHash
}

export const storeAuthToken = async (selector: Buffer, verifierHash: Buffer) => {
  // Store selector in dynamo DB instance along with hash(verifier)
}

export const splitSelectorVerifier = async (token: string): Promise<AuthToken> => {
  const tokenBuf = Buffer.from(token, 'base64')
  const selector = tokenBuf.slice(0, 16)
  const verifier = tokenBuf.slice(16)
  return { selector, verifier }
}

export const deleteSelector = async (authToken: AuthToken) => {
  // Delete authToken.selector from dynamo db instance
}

export const getStoredVerifierHash = async (authToken: AuthToken): Promise<Buffer> => {
  // Lookup resetToken.selector in DB and return stored verifier hash
  return Buffer.alloc(0)
}

export const compareHashes = async (a: Buffer, b: Buffer): Promise<boolean> => {
  if (a.length !== b.length) return false
  return sodium.sodium_memcmp(a, b)
}

export const createNewAccount = async (body: CreateAccountBody): Promise<UserAccount> => {
  try {
    return sqlModels.Account.findOrCreate({ where: { email: body.email }, defaults: body })
  } catch (e) {
    return Promise.reject(e)
  }
}

export const getAccount = async (body: GetAccountBody): Promise<UserAccount> => {
  try {
    return sqlModels.Account.findOne({ where: { email: body.email }})
  } catch (e) {
    return Promise.reject(e)
  }
}

