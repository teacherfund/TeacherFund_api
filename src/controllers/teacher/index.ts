import {BaseContext} from 'koa'
import * as Strings from '../../helpers/strings'
import * as teacherController from './teacher'
import {Teacher} from '../../@types/teacher'

export default class TeacherController {
  constructor() {}

  public async createTeacher(ctx: BaseContext) {
    const { email, firstName, lastName } = ctx.request.body
    ctx.assert(email, 400, Strings.EmailIsRequired)
    ctx.assert(firstName, 400, Strings.FirstNameIsRequired)
    ctx.assert(lastName, 400, Strings.LastNameIsRequired)

    const createTeacherBody: teacherController.CreateTeacherBody = {
      email,
      firstName,
      lastName
    }

    const teacher: Teacher = await teacherController.createNewTeacher(createTeacherBody)

    ctx.status = 200
    ctx.body = { ok: true, teacher }
  }

  public async getTeacher(ctx: BaseContext) {
    const { email } = ctx.request.body
    ctx.assert(email, 400, Strings.EmailIsRequired)

    const teacher: Teacher = await teacherController.getTeacher(email)

    ctx.status = 200
    ctx.body = { ok: true, teacher }
  }

  public async getAllTeachers(ctx: BaseContext) {
    const teachers: Teacher[] = await teacherController.getAllTeachers()
    ctx.status = 200
    ctx.body = { ok: true }
  }

  public async updateTeacher(ctx: BaseContext) {
    const { email } = ctx.request.body
    ctx.assert(email, 400, Strings.EmailIsRequired)

    const updateTeacherBody: teacherController.UpdateTeacherBody = {
      email,
      firstName: ctx.request.body.firstName,
      lastName: ctx.request.body.lastName,
      id: ctx.request.body.id
    }

    const teacher: Teacher = await teacherController.updateTeacher(updateTeacherBody)

    ctx.status = 200
    ctx.body = { ok: true, teacher }
  }

  public async deleteTeacher(ctx: BaseContext) {
    const { email } = ctx.request.body
    ctx.assert(email, 400, Strings.EmailIsRequired)

    await teacherController.deleteTeacher(email)

    ctx.status = 200
    ctx.body = { ok: true }
  }
}