import sodium from 'sodium-native'
const AWS = require('aws-sdk')
const path = require('path')
AWS.config.loadFromPath(path.join(__dirname, '../../../awscredentials.json'))
if (!AWS.config.region) {
  AWS.config.update({
    region: 'us-east-1'
  })
}
const docClient = new AWS.DynamoDB.DocumentClient()
import {CreateAccountBody, UserAccount, GetAccountBody, GenerateTokenInfo} from '../../@types/account'
const sqlModels = require('../../models')
const TABLE_NAME = 'tokens'
const INDEX_NAME = 'selector-index'

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
export const generateAndStoreToken = async (info: GenerateTokenInfo): Promise<string> => {
  const { email, role } = info.ctx.request.body
  // Create activation token
  const token = await generateAuthToken()

  // Get verifier hash
  const verifierHash = await getVerifierHash(token)

  // Store json blob of request in dynamo db with key of activation token
  await storeAuthToken(email, role, token.selector, verifierHash, info.longLiveToken, info.registered, info.meta)

  // Send magic link via sendgrid helper service
  const emailToken = await getEmailAuthToken(token)
  return emailToken
}

export const getEmailAuthToken = async (input: AuthToken): Promise<string> => {
  return Buffer.concat([input.selector, input.verifier]).toString('hex')
}

export const getVerifierHash = async (input: AuthToken): Promise<Buffer> => {
  const verifierHash = Buffer.alloc(sodium.crypto_generichash_BYTES)
  sodium.crypto_generichash(verifierHash, input.verifier)
  return verifierHash
}

export const storeAuthToken = async (
  email: string, 
  role: string, selector: Buffer, 
  verifierHash: Buffer, 
  longterm: boolean,
  registered: boolean,
  meta: {}
) => {
  // expiration will be UTC time since epoch of when this token expires
  let expiration: number
  const now = Date.now()
  if (longterm) {
    expiration = now + MILISECONDS_MONTH
  } else {
    expiration = now + MILISECONDS_15_MINUTES
  }

  // Store email and selector in dynamo DB instance along with hash(verifier)
  const createParams = {
    Item: {
      email,
      registered,
      role,
      selector: selector.toString('hex'),
      verifierHash: verifierHash.toString('hex'),
      expiration,
      ...meta
    },
    TableName: TABLE_NAME,
    ReturnValues: 'ALL_OLD'
  }
  try {
    await docClient.put(createParams).promise()
  } catch (e) {
    console.error(e)
  }
}

export const splitSelectorVerifier = async (token: string): Promise<AuthToken> => {
  const tokenBuf = Buffer.from(token, 'hex')
  const selector = tokenBuf.slice(0, 16)
  const verifier = tokenBuf.slice(16)
  return { selector, verifier }
}

export const deleteSelector = async (sessionInfo: any) => {
  // Delete authToken.selector from dynamo db instance
  const params = {
    Key: { email: sessionInfo.email },
    TableName: TABLE_NAME
  }
  try {
    await docClient.delete(params).promise()
  } catch (e) {
    console.error(e)
  }
}

export const getStoredSession = async (authToken: AuthToken): Promise<any> => {
  // Lookup resetToken.selector in DB and return stored verifier hash
  const hexSelector = authToken.selector.toString('hex')
  const params = {
    KeyConditionExpression: 'selector = :selector',
    ExpressionAttributeValues: { ':selector': hexSelector },
    IndexName: INDEX_NAME,
    TableName: TABLE_NAME
  }
  try {
    const result = await docClient.query(params).promise()
    if (!result || !result.Count) {
      throw new Error('Empty result set')
    }
    return Promise.resolve(result.Items.pop())
  } catch (e) {
    console.error(e)
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

