const sqlModels = require('../../models')
import {Teacher} from '../../@types/teacher'

export interface CreateTeacherBody {
  email: string,
  firstName: string,
  lastName: string
}

export interface UpdateTeacherBody {
  id?: number
  email: string,
  firstName?: string,
  lastName?: string
}

export const createNewTeacher = (body: CreateTeacherBody): Promise<Teacher> => {
  try {
    return sqlModels.Teacher.findOrCreate({ where: { email: body.email }, defaults: body })
  } catch (e) {
    return Promise.reject(e)
  }
}

export const getTeacher = (body: string): Promise<Teacher> => {
  try {
    return sqlModels.Teacher.find({ where: {email: body}})
  } catch (e) {
    return Promise.reject (e)
  }
}

export const getAllTeachers = (): Promise<Teacher[]> => {
  try {
    return sqlModels.Teacher.findAll()
  } catch (e) {
    return Promise.reject (e)
  }
}

export const updateTeacher = (body: UpdateTeacherBody): Promise<Teacher> => {
  try {
    return sqlModels.Teacher.find({ where: {email: body.email }})
    .then((localTeacher: any) => {
      return localTeacher.save(body)
    })
    .catch((err: any) => {
      return Promise.reject(err)
    })
  } catch (e) {
    return Promise.reject(e)
  }
}

export const deleteTeacher = (body: UpdateTeacherBody): Promise<Teacher> => {
  try {
    return sqlModels.Teacher.find({ where: { email: body.email }})
    .then((localTeacher: any) => {
      return localTeacher.destroy()
    })
  } catch (e) {
    return Promise.reject(e)
  }
}