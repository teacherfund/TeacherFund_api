import anyTest, {TestInterface} from 'ava'
import { BaseContext } from 'koa'
import general from '../../src/controllers/general'

const test = anyTest as TestInterface<{ ctx: BaseContext }>

test.beforeEach((t) => {
  t.context = { ctx: {} as BaseContext }
})

test('alive endpoint', async (t) => {
  general.alive(t.context.ctx)
  t.deepEqual(t.context.ctx.status, 200)
})
