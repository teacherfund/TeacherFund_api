import {BaseContext} from 'koa'
import * as Strings from '../../helpers/strings'
import * as userController from './user'
import {User} from '../../@types/user'

export default class UserController {
  public async createUser(ctx: BaseContext) {
    const { email, firstName, lastName } = ctx.request.body
    ctx.assert(email, 400, Strings.EmailIsRequired)
    ctx.assert(firstName, 400, Strings.FirstNameIsRequired)
    ctx.assert(lastName, 400, Strings.LastNameIsRequired)

    const createUserBody: userController.CreateUserBody = {
      email,
      firstName,
      lastName,
      meta: ctx.request.body.meta
    }

    const user: User = await userController.createNewUser(createUserBody)

    ctx.status = 200
    ctx.body = { ok: true, user }
  }

  public async getUser(ctx: BaseContext) {
    const { id } = ctx.request.body
    ctx.assert(id, 400, Strings.UserIdIsRequired)

    const user: User = await userController.getUser(id)

    ctx.status = 200
    ctx.body = { ok: true, user }
  }

  public async getAllUsers(ctx: BaseContext) {
    const users: User[] = await userController.getAllUsers()
    ctx.status = 200
    ctx.body = { ok: true, users }
  }

  public async updateUser(ctx: BaseContext) {
    const { id } = ctx.request.body
    ctx.assert(id, 400, Strings.UserIdIsRequired)

    const updateUserBody: userController.UpdateUserBody = {
      firstName: ctx.request.body.firstName,
      lastName: ctx.request.body.lastName,
      meta: ctx.request.body.meta,
      id: ctx.request.body.id,
    }

    const user: User = await userController.updateUser(updateUserBody)

    ctx.status = 200
    ctx.body = { ok: true, user }
  }

  public async deleteUser(ctx: BaseContext) {
    const { id } = ctx.request.body
    ctx.assert(id, 400, Strings.UserIdIsRequired)

    await userController.deleteUser(id)

    ctx.status = 200
    ctx.body = { ok: true }
  }
}