import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import RoleValidator from 'App/Validators/RoleValidator'
import { bind } from '@adonisjs/route-model-binding'

export default class RolesController {
  public async index({ response }){
    const roles = await Role.all()
    return response.ok({
      msg:"roles got",
      data: roles
    })
  }
  @bind()
  public async update({ params, request }, role: Role){
    await role.update(request.body())
    return { msg: 'role updated' }
  }

  @bind()
  public async destroy({ params }, role: Role){
    const role = await Role.findOrFail(params.id)
    await role.delete()
    return { msg: 'role deleted' }
  }
  @bind()
  public async show({ params }, role: Role){
    const role = await Role.findOrFail(params.id)
    return {
      msg: 'role got',
      data: role.toJSON()
    }
  }
  public async store({request, response }: HttpContextContract){
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
