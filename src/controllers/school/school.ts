const sqlModels = require('../../models')
import {School} from '../../@types/school'

export interface CreateSchoolBody {
  streetAddress: string,
  city: string,
  state: string,
  zip: string,
  schoolCode: string,
  meta: any
}

export interface UpdateSchoolBody {
  id?: number
  meta?: any,
}

export const createNewSchool = (body: CreateSchoolBody): Promise<School> => {
  try {
    return sqlModels.School.create(body)
  } catch (e) {
    return Promise.reject(e)
  }
}

export const getSchool = (id: string): Promise<School> => {
  try {
    return sqlModels.School.find({ where: {id: id}})
  } catch (e) {
    return Promise.reject (e)
  }
}

export const getAllSchools = (): Promise<School[]> => {
  try {
    return sqlModels.School.findAll()
  } catch (e) {
    return Promise.reject (e)
  }
}

export const updateSchool = async (body: UpdateSchoolBody): Promise<School> => {
  try {
    const localSchool = await sqlModels.School.find({ where: {id: body.id }})
    return localSchool.save(body)
  } catch (e) {
    return Promise.reject(e)
  }
}

export const deleteSchool = async (body: UpdateSchoolBody): Promise<School> => {
  try {
    const localSchool = await sqlModels.School.find({ where: { id: body.id }})
    return localSchool.destroy()
  } catch (e) {
    return Promise.reject(e)
  }
}