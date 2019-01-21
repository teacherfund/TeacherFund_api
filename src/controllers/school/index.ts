import {BaseContext} from 'koa'
import * as Strings from '../../helpers/strings'
import * as schoolController from './school'
import {School} from '../../@types/school'

export default class SchoolController {
  public async createSchool(ctx: BaseContext) {
    const { streetAddress, city, state, zip, schoolCode } = ctx.request.body
    ctx.assert(streetAddress, 400, Strings.StreetAddressIsRequired)
    ctx.assert(city, 400, Strings.CityIsRequired)
    ctx.assert(state, 400, Strings.StateIsRequired)
    ctx.assert(schoolCode, 400, Strings.SchoolCodeIsRequired)

    const createSchoolBody: schoolController.CreateSchoolBody = {
      streetAddress,
      city,
      state,
      zip,
      schoolCode,
      meta: ctx.request.body.meta
    }

    const school: School = await schoolController.createNewSchool(createSchoolBody)

    ctx.status = 200
    ctx.body = { ok: true, school }
  }

  public async getSchool(ctx: BaseContext) {
    const { id } = ctx.request.body
    ctx.assert(id, 400, Strings.SchoolIdIsRequired)

    const school: School = await schoolController.getSchool(id)

    ctx.status = 200
    ctx.body = { ok: true, school }
  }

  public async getAllSchools(ctx: BaseContext) {
    const schools: School[] = await schoolController.getAllSchools()
    ctx.status = 200
    ctx.body = { ok: true, schools }
  }

  public async updateSchool(ctx: BaseContext) {
    const { id } = ctx.request.body
    ctx.assert(id, 400, Strings.SchoolIdIsRequired)

    const updateSchoolBody: schoolController.UpdateSchoolBody = {
      meta: ctx.request.body.meta,
      id: ctx.request.body.id,
    }

    const school: School = await schoolController.updateSchool(updateSchoolBody)

    ctx.status = 200
    ctx.body = { ok: true, school }
  }

  public async deleteSchool(ctx: BaseContext) {
    const { id } = ctx.request.body
    ctx.assert(id, 400, Strings.SchoolIdIsRequired)

    await schoolController.deleteSchool(id)

    ctx.status = 200
    ctx.body = { ok: true }
  }
}