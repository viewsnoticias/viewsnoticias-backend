import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import News from 'App/Models/News'
import User from "App/Models/User"
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public async index({ response }){
    const users = await User.all()
    for (const i in users){
      await users[i].load('roles')
    }
    return response.ok({
      msg:"users got",
      data: users
    })
  }
  public async update({ params, request }){
    const body = request.body()
    const user = await User.findOrFail(params.id)
    if (body.roles){
      await user.related('roles').detach()
      await user.related('roles').attach(body.roles)
    }
    await user.update(body)
    return { msg: 'user updated' }
  }
  public async destroy({ params }){
    const user = await User.findOrFail(params.id)
    await user.delete()
    return { msg: 'user deleted' }
  }
  public async show({ params }){
    const user = await User.findOrFail(params.id)
    await user.load('roles')
    return {
      msg: 'user got',
      data: user.toJSON()
    }
  }

  public async store({request, response}: HttpContextContract){
    try{
      const varifiedData = await request.validate(UserValidator)
      const data = { ...varifiedData, roles: undefined }
      const roles = varifiedData.roles 

      const createdUser = new User()
      createdUser.fill({ ...data,email: data.email.toLowerCase() })
      await createdUser.save()
      await createdUser.related('roles').attach(roles)
      return response.created({
        msg:"the user were created",
        data: createdUser.toJSON()
      })
    } catch(err){
      console.log('USER-STORE',err)
      return response.badRequest(err)
    }
  }
}
