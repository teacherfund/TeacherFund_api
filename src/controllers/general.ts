import { BaseContext } from 'koa'

export default class GeneralController {
  public static async alive (ctx: BaseContext) {
    ctx.status = 200
    ctx.body = { ok: true }
  }
}
