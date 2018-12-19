const test = require('ava')
const { default: general } = require('../../dist/controllers/general')

test('alive endpoint', async (t) => {
  let ctx = {}
  general.alive(ctx)
  t.deepEqual(ctx.status, 200)
})
