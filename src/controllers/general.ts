import { Context } from 'koa'

export default class GeneralController {
  public static async alive (ctx: Context) {
    ctx.status = 200
    ctx.body = { ok: true }
  }
}
