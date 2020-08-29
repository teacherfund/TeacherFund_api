import {Context} from 'koa'
import * as Strings from '../../helpers/strings'
import * as payoutController from './payout'
import {Payout} from '../../@types/payout'

export default class PayoutController {
  public async createPayout(ctx: Context) {
    const { teacherId, amount, description, location } = ctx.request.body
    ctx.assert(teacherId, 400, Strings.TeacherIdIsRequired)
    ctx.assert(amount, 400, Strings.AmountIsRequired)
    ctx.assert(description, 400, Strings.DescriptionIsRequired)
    ctx.assert(location, 400, Strings.LocationIsRequired)

    const createPayoutBody: payoutController.CreatePayoutBody = {
      teacherId,
      amount,
      description,
      location,
      meta: ctx.request.body.meta
    }

    const payout: Payout = await payoutController.createNewPayout(createPayoutBody)

    ctx.status = 200
    ctx.body = { ok: true, payout }
  }

  public async getPayout(ctx: Context) {
    const { id } = ctx.request.body
    ctx.assert(id, 400, Strings.PayoutIdIsRequired)

    const payout: Payout = await payoutController.getPayout(id)

    ctx.status = 200
    ctx.body = { ok: true, payout }
  }

  public async getAllPayouts(ctx: Context) {
    const payouts: Payout[] = await payoutController.getAllPayouts()
    ctx.status = 200
    ctx.body = { ok: true, payouts }
  }

  public async updatePayout(ctx: Context) {
    const { id } = ctx.request.body
    ctx.assert(id, 400, Strings.PayoutIdIsRequired)

    const updatePayoutBody: payoutController.UpdatePayoutBody = {
      description: ctx.request.body.description,
      id: ctx.request.body.id,
      location: ctx.request.body.location,
      meta: ctx.request.body.meta
    }

    const payout: Payout = await payoutController.updatePayout(updatePayoutBody)

    ctx.status = 200
    ctx.body = { ok: true, payout }
  }
}