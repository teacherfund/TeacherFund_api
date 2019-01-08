import {BaseContext} from 'koa'
import * as Strings from '../../helpers/strings'
import * as donationController from './donation'
import {Donation} from '../../@types/donation'

export default class DonationController {
  public async createDonation(ctx: BaseContext) {
    const { userId, amount, frequency } = ctx.request.body
    ctx.assert(userId, 400, Strings.UserIdIsRequired)
    ctx.assert(amount, 400, Strings.AmountIsRequired)
    ctx.assert(frequency, 400, Strings.FrequencyIsRequired)

    const createDonationBody: donationController.CreateDonationBody = {
      userId,
      date: new Date(),
      amount,
      frequency
    }

    const donation: Donation = await donationController.createNewDonation(createDonationBody)

    ctx.status = 200
    ctx.body = { ok: true, donation }
  }

  public async getDonation(ctx: BaseContext) {
    const { id } = ctx.request.body
    ctx.assert(id, 400, Strings.DonationIdIsRequired)

    const donation: Donation = await donationController.getDonation(id)

    ctx.status = 200
    ctx.body = { ok: true, donation }
  }

  public async getAllDonations(ctx: BaseContext) {
    const donations: Donation[] = await donationController.getAllDonations()
    ctx.status = 200
    ctx.body = { ok: true, donations }
  }

  public async updateDonation(ctx: BaseContext) {
    const { id } = ctx.request.body
    ctx.assert(id, 400, Strings.DonationIdIsRequired)

    const updateDonationBody: donationController.UpdateDonationBody = {
      frequency: ctx.request.body.frequency,
      id: ctx.request.body.id,
      amount: ctx.request.body.amount
    }

    const donation: Donation = await donationController.updateDonation(updateDonationBody)

    ctx.status = 200
    ctx.body = { ok: true, donation }
  }

  public async deleteDonation(ctx: BaseContext) {
    const { id } = ctx.request.body
    ctx.assert(id, 400, Strings.DonationIdIsRequired)

    await donationController.deleteDonation(id)

    ctx.status = 200
    ctx.body = { ok: true }
  }
}