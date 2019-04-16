const sqlModels = require('../../models')
import {Donation, Frequency} from '../../@types/donation'

export interface CreateDonationBody {
  userId: number,
  frequency: Frequency,
  amount: number,
  date: Date
}

export interface UpdateDonationBody {
  id?: number
  frequency?: Frequency,
  amount: number
}

export interface GetDonationBody {
  email: string
}

export const createNewDonation = (body: CreateDonationBody): Promise<Donation> => {
  try {
    return sqlModels.Donation.create(body)
  } catch (e) {
    return Promise.reject(e)
  }
}

export const getDonation = (id: string): Promise<Donation> => {
  try {
    return sqlModels.Donation.find({ where: {id: id}})
  } catch (e) {
    return Promise.reject (e)
  }
}

export const getAllDonations = (): Promise<Donation[]> => {
  try {
    return sqlModels.Donation.findAll()
  } catch (e) {
    return Promise.reject (e)
  }
}

export const getDonationsForUser = (body: GetDonationBody): Promise<Donation[]> => {
  try {
    return sqlModels.Donation.find({ where: { email: body.email }})
  } catch (e) {
    return Promise.reject(e)
  }
}

export const updateDonation = async (body: UpdateDonationBody): Promise<Donation> => {
  try {
    const localDonation = await sqlModels.Donation.find({ where: {id: body.id }})
    return localDonation.save(body)
  } catch (e) {
    return Promise.reject(e)
  }
}

export const deleteDonation = async (body: UpdateDonationBody): Promise<Donation> => {
  try {
    const localDonation = await sqlModels.Donation.find({ where: { id: body.id }})
    return localDonation.destroy()
  } catch (e) {
    return Promise.reject(e)
  }
}