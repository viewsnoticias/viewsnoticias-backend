import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import RoleValidator from 'App/Validators/RoleValidator'

export default class RolesController {
  public async index({ response }){
    const roles = await Role.all()
    return response.ok({
      msg:"roles got",
      data: roles
    })
  }
  public async update({ params, request }){
    const role = await Role.findOrFail(params.id)
    await role.update(request.body())

    return { msg: 'role updated' }
  }
  public async destroy({ params }){
    const role = await Role.findOrFail(params.id)
    await role.delete()
    return { msg: 'role deleted' }
  }
  public async show({ params }){
    const role = await Role.findOrFail(params.id)
    return {
      msg: 'role got',
      data: role.toJSON()
    }
  }
  public async store({request, response}: HttpContextContract){
    try{
      const data = await request.validate(RoleValidator)

      const createdRole = new Role()
      createdRole.fill({ ...data })
      await createdRole.save()
      return response.created({
        msg:"the role were created",
        data: createdRole.toJSON()
      })
    } catch(err){
      return response.badRequest(err)
    }
  }
}
