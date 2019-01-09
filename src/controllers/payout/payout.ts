const sqlModels = require('../../models')
import {Payout} from '../../@types/payout'

export interface CreatePayoutBody {
  description: string,
  teacherId: number,
  amount: number,
  location: string,
  meta: {}
}

export interface UpdatePayoutBody {
  id: number,
  teacherId?: number
  amount?: number,
  description?: string,
  location?: string,
  meta?: {}
}

export const createNewPayout = (body: CreatePayoutBody): Promise<Payout> => {
  try {
    return sqlModels.Payout.create(body)
  } catch (e) {
    return Promise.reject(e)
  }
}

export const getPayout = (id: string): Promise<Payout> => {
  try {
    return sqlModels.Payout.find({ where: {id: id}})
  } catch (e) {
    return Promise.reject (e)
  }
}

export const getAllPayouts = (): Promise<Payout[]> => {
  try {
    return sqlModels.Payout.findAll()
  } catch (e) {
    return Promise.reject (e)
  }
}

export const updatePayout = async (body: UpdatePayoutBody): Promise<Payout> => {
  try {
    const localPayout = await sqlModels.Payout.find({ where: {id: body.id }})
    return localPayout.save(body)
  } catch (e) {
    return Promise.reject(e)
  }
}
