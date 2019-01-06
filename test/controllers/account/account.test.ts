import test from 'ava'
import sinon from 'sinon'
import sodium from 'sodium-native'
import Account from '../../../src/controllers/account/account'

test('generate reset token makes a reset token', async (t) => {
  let stub = sinon.stub(sodium, 'randombytes_buf')
  let { selector, verifier } = await Account.generateResetToken()
  t.deepEqual(selector, Buffer.alloc(16))
  t.deepEqual(verifier, Buffer.alloc(16))
  stub.restore()
})
