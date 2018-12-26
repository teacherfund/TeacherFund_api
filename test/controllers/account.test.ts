import anyTest, { TestInterface } from 'ava'
import { BaseContext } from 'koa'
import account from '../../src/controllers/account'

const test = anyTest as TestInterface<{ ctx: BaseContext }>

test.beforeEach((t) => {
  t.context = { ctx: {} as BaseContext }
  t.context.ctx.log = {
    info: () => {}
  }
})

test('request password reset token endpoint', async (t) => {
  account.requestReset(t.context.ctx)
  t.deepEqual(t.context.ctx.status, 200)
  t.deepEqual(t.context.ctx.body, { ok: true })
})

test('receive password reset token endpoint', async (t) => {
  t.context.ctx.request = {
    body: {
      token: 'MI3KSxt5cVgLF8/+UzD8JZXUIJB+RXmX6k+8Ic97k2CzmeLSH4LiEexxzQRW09Gq'
    }
  }
  account.receiveReset(t.context.ctx)
  t.deepEqual(t.context.ctx.status, 200)
  t.deepEqual(t.context.ctx.body, { ok: true })
})
