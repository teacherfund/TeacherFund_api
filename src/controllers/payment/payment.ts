const sqlModels = require('../../models')
import {Payment} from '../../@types/payment'

export interface CreatePaymentBody {
  userId: number,
  amount: number,
  date: Date
}

export interface UpdatePaymentBody {
  id?: number
  amount: number
}

export const createNewPayment = (body: CreatePaymentBody): Promise<Payment> => {
  try {
    return sqlModels.Payment.create(body)
  } catch (e) {
    return Promise.reject(e)
  }
}

export const getPayment = (id: string): Promise<Payment> => {
  try {
    return sqlModels.Payment.find({ where: {id: id}})
  } catch (e) {
    return Promise.reject (e)
  }
}

export const getAllPayments = (): Promise<Payment[]> => {
  try {
    return sqlModels.Payment.findAll()
  } catch (e) {
    return Promise.reject (e)
  }
}
