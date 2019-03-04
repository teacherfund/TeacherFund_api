import {BaseContext} from 'koa'
import * as Strings from '../../helpers/strings'
import * as donationController from './donation'
import * as accountController from '../account/account'
import * as userController from '../user/user'
import {Donation} from '../../@types/donation'
import {CreateAccountBody, UserAccount} from '../../@types/account'
import {User} from '../../@types/user'
const config = require('../../../config')
console.log('config', config)
const stripe = require('stripe')(config.stripe.secretKey)
stripe.setApiVersion(config.stripe.apiVersion)

export default class DonationController {
  public static async createDonation(ctx: BaseContext) {
    const { email, amount, frequency, source, meta } = ctx.request.body
    ctx.assert(amount, 400, Strings.AmountIsRequired)
    ctx.assert(frequency, 400, Strings.FrequencyIsRequired)

    // If one time donation
    let userId = 0
    let errorMessage = ''
    let stripeStatus

    try {
      if (frequency === 'once') {
        const createUserBody: userController.CreateUserBody = {
          email,
          firstName: ctx.request.body.firstName,
          lastName: ctx.request.body.lastName,
        }
        
        // create a user
        const user: User = await userController.createNewUser(createUserBody)
        userId = user.id

        // create a charge 
        // Create a stripe charge for the order 
        let {status, failure_message} = await stripe.charges.create({
          amount,
          currency: 'usd',
          description: 'Donation',
          source: source.id,
          metadata: meta,
          receipt_email: email
        })
        errorMessage = failure_message
        stripeStatus = status
      }

      if (frequency === 'month') {
        // if recurring - create recurring payment and account with that email

        // create an account in backend
        const createAccountBody: CreateAccountBody = {
          email,
          firstName: ctx.request.body.firstName,
          lastName: ctx.request.body.lastName,
          role: 'donor'
        }
        
        const account: UserAccount = await accountController.createNewAccount(createAccountBody)
        userId = account.id

        // create a customer in stripe from this account info 
        const customer = await stripe.customers.create({
          email,
          metadata: meta,
          source: source.id
        })

        // create the plan according to how much they want to monthly donate 
        const plan = stripe.plans.create({
          amount,
          interval: "month",
          product: {
            name: "Teacherfund donation"
          },
          currency: "usd",
        })

        // create a subscription with the plan ID and the customer ID
        await stripe.subscriptions.create({
          customer: customer.id,
          items: [
            {
              plan: plan.id,
            },
          ]
        })
      } 
    } catch (e) {
      ctx.status = 200
      ctx.body = { ok: false, message: e.message }
      return
    }

    // Create the donation in our backend 
    const createDonationBody: donationController.CreateDonationBody = {
      userId,
      date: new Date(),
      amount,
      frequency
    }

    const donation: Donation = await donationController.createNewDonation(createDonationBody)

    ctx.status = 200
    ctx.body = { ok: true, donation, status: stripeStatus, message: errorMessage }
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