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
    // Convert donation to cents
    const donationAmount = amount * 100

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
          amount: donationAmount,
          currency: 'usd',
          description: 'Donation',
          source: source.id,
          metadata: meta,
          receipt_email: email
        })
        errorMessage = failure_message
        stripeStatus = status
      }

      if (frequency === 'monthly') {
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
        const plan = await stripe.plans.create({
          amount: donationAmount,
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
      amount: donationAmount,
      frequency
    }

    const donation: Donation = await donationController.createNewDonation(createDonationBody)

    ctx.status = 200
    ctx.body = { ok: true, donation, status: stripeStatus, message: errorMessage }
  }

  public static async getDonation(ctx: BaseContext) {
    const { id } = ctx.request.body
    ctx.assert(id, 400, Strings.DonationIdIsRequired)

    const donation: Donation = await donationController.getDonation(id)

    ctx.status = 200
    ctx.body = { ok: true, donation }
  }

  public static async getDonationsForUser(ctx: BaseContext) {
    const { email } = ctx.request.body
    const getAccountBody = { email }
    
    try {
      const account: UserAccount = await accountController.getAccount(getAccountBody)
      const userId = account.id

      ctx.assert(userId, 400, "User not found")

      const donations: Donation[] = await donationController.getDonationsForUser({ email })

      ctx.status = 200
      ctx.body = { ok: true, donations }
    } catch (e) {
      ctx.status = 200
      ctx.body = { ok: false, message: e}
    }
  }

  public static async getAllDonations(ctx: BaseContext) {
    const donations: Donation[] = await donationController.getAllDonations()
    ctx.status = 200
    ctx.body = { ok: true, donations }
  }

  public static async updateDonation(ctx: BaseContext) {
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

  public static async deleteDonation(ctx: BaseContext) {
    const { id } = ctx.request.body
    ctx.assert(id, 400, Strings.DonationIdIsRequired)

    await donationController.deleteDonation(id)

    ctx.status = 200
    ctx.body = { ok: true }
  }
}