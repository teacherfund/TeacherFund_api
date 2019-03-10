import sodium from 'sodium-native'
const dynamo = require('dynamodb')
const AWS = require('aws-sdk')
const Joi = require('joi')
dynamo.AWS.config.loadFromPath('../../awscredentials.json');
import {CreateAccountBody, UserAccount, GetAccountBody} from '../../@types/account'
import { join } from 'path';
const sqlModels = require('../../models')

interface AuthToken {
  selector: Buffer
  verifier: Buffer
}

const Account = dynamo.define('Account', {
  hashKey : 'email',
 
  // add the timestamp attributes (updatedAt, createdAt)
  timestamps : true,
 
  schema: {
    email: Joi.string().email(),
    selector: Joi.string(),
    verifier: Joi.string(),
    expiresAt: Joi.date(),
  }
})

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

export const storeAuthToken = async (email: string, role: string, selector: Buffer, verifierHash: Buffer) => {
  // Store email and selector in dynamo DB instance along with hash(verifier)
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

