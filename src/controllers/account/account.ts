import sodium from 'sodium-native'
import { BaseContext } from 'koa'
const AWS = require('aws-sdk')
const path = require('path')
AWS.config.loadFromPath(path.join(__dirname, '../../../awscredentials.json'))
AWS.config.update({region:'us-east-1'})
const docClient = new AWS.DynamoDB.DocumentClient()
import {CreateAccountBody, UserAccount, GetAccountBody} from '../../@types/account'
const sqlModels = require('../../models')
const TABLE_NAME = 'tokens'

export const MILISECONDS_MONTH = 2.628e+9
export const MILISECONDS_15_MINUTES = 900000

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

// Abstract function to generate and store token and return for emailing
export const generateAndStoreToken = async (ctx: BaseContext, longLiveToken: boolean): Promise<string> => {
  const { email, role } = ctx.request.body
  // Create activation token
  const token = await generateAuthToken()

  // Get verifier hash
  const verifierHash = await getVerifierHash(token)

  // Store json blob of request in dynamo db with key of activation token
  await storeAuthToken(email, role, token.selector, verifierHash, longLiveToken)

  // Send magic link via sendgrid helper service
  const emailToken = await getEmailAuthToken(token)
  return emailToken
}

export const getEmailAuthToken = async (input: AuthToken): Promise<string> => {
  return Buffer.concat([input.selector, input.verifier]).toString('base64')
}

export const getVerifierHash = async (input: AuthToken): Promise<Buffer> => {
  const verifierHash = Buffer.alloc(sodium.crypto_generichash_BYTES)
  sodium.crypto_generichash(verifierHash, input.verifier)
  return verifierHash
}

export const storeAuthToken = async (email: string, role: string, selector: Buffer, verifierHash: Buffer, longterm: boolean) => {
  // expiration will be UTC time since epoch of when this token expires
  let expiration: number
  const now = new Date()
  const utcNow = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds())
  if (longterm) {
    expiration = utcNow + MILISECONDS_MONTH
  } else {
    expiration = utcNow + MILISECONDS_15_MINUTES
  }

  // Store email and selector in dynamo DB instance along with hash(verifier)
  const updateParams = {
    Key: { email: { S: email } },
    Item: {
      email,
      role,
      selector,
      verifierHash,
      expiration
    },
    // ExpressionAttributeNames: { 
    //   '#R': 'role',
    //   '#S': 'selector',
    //   '#V': 'verifierHash',
    //   '#E': 'expiration'
    // },
    // ExpressionAttributeValues: { 
    //   ':r': role,
    //   ':s': selector,
    //   ':v': verifierHash,
    //   ':e': expiration
    // },
    TableName: TABLE_NAME,
    ReturnValues: 'ALL_OLD'
  }
  try {
    await docClient.put(updateParams).promise()
  } catch (e) {
    console.error(e)
  }
}

export const splitSelectorVerifier = async (token: string): Promise<AuthToken> => {
  const tokenBuf = Buffer.from(token, 'base64')
  const selector = tokenBuf.slice(0, 16)
  const verifier = tokenBuf.slice(16)
  return { selector, verifier }
}

export const deleteSelector = async (authToken: AuthToken) => {
  // Delete authToken.selector from dynamo db instance
  const params = {
    Key: { selector: { S: authToken.selector }}, 
    TableName: TABLE_NAME
  }
  try {
    await docClient.deleteItem(params).promise()
  } catch (e) {
    console.error(e)
  }
}

export const getStoredVerifierHash = async (authToken: AuthToken): Promise<any> => {
  // Lookup resetToken.selector in DB and return stored verifier hash
  const params = {
    Key: { selector: { S: authToken.selector }}, 
    TableName: TABLE_NAME
  }
  try {
    const token = await docClient.getItem(params).promise()
    return Promise.resolve(token)
  } catch (e) {
    return Promise.reject('Could not find token')
  }
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

