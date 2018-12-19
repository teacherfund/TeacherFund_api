import { BaseContext } from 'koa'

export default {
  alive: async (ctx: BaseContext) => {
    ctx.status = 200
  }
}
