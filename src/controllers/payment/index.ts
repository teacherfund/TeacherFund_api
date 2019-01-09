import {BaseContext} from 'koa'
import * as Strings from '../../helpers/strings'
import * as paymentController from './payment'
import {Payment} from '../../@types/payment'

export default class PaymentController {
  public async createPayment(ctx: BaseContext) {
    const { userId, amount } = ctx.request.body
    ctx.assert(userId, 400, Strings.UserIdIsRequired)
    ctx.assert(amount, 400, Strings.AmountIsRequired)

    const createPaymentBody: paymentController.CreatePaymentBody = {
      userId,
      date: new Date(),
      amount
    }

    const payment: Payment = await paymentController.createNewPayment(createPaymentBody)

    ctx.status = 200
    ctx.body = { ok: true, payment }
  }

  public async getPayment(ctx: BaseContext) {
    const { id } = ctx.request.body
    ctx.assert(id, 400, Strings.PaymentIdIsRequired)

    const payment: Payment = await paymentController.getPayment(id)

    ctx.status = 200
    ctx.body = { ok: true, payment }
  }

  public async getAllPayments(ctx: BaseContext) {
    const payments: Payment[] = await paymentController.getAllPayments()
    ctx.status = 200
    ctx.body = { ok: true, payments }
  }
}