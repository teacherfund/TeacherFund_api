const sqlModels = require('../../models')
import {User} from '../../@types/user'

export interface CreateUserBody {
  email: string,
  firstName?: string,
  lastName?: string,
  meta?: any
}

export interface UpdateUserBody {
  id?: number
  firstName?: string,
  lastName?: string,
  meta?: string,
}

export const createNewUser = (body: CreateUserBody): Promise<User> => {
  try {
    return sqlModels.User.create(body)
  } catch (e) {
    return Promise.reject(e)
  }
}

export const getUser = (id: string): Promise<User> => {
  try {
    return sqlModels.User.find({ where: {id: id}})
  } catch (e) {
    return Promise.reject (e)
  }
}

export const getAllUsers = (): Promise<User[]> => {
  try {
    return sqlModels.User.findAll()
  } catch (e) {
    return Promise.reject (e)
  }
}

export const updateUser = async (body: UpdateUserBody): Promise<User> => {
  try {
    const localUser = await sqlModels.User.find({ where: {id: body.id }})
    return localUser.save(body)
  } catch (e) {
    return Promise.reject(e)
  }
}

export const deleteUser = async (body: UpdateUserBody): Promise<User> => {
  try {
    const localUser = await sqlModels.User.find({ where: { id: body.id }})
    return localUser.destroy()
  } catch (e) {
    return Promise.reject(e)
  }
}