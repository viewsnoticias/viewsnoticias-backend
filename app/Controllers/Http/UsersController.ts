import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import News from 'App/Models/News'

import User from "App/Models/User"
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public async index({ response }){
    const users = await User.all()
    return response.ok({
      msg:"users got",
      data: users
    })
  }
  public async update({ params, request }){
    const user = await User.findOrFail(params.id)
    await user.update(request.body())
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
  public async myNews({ response, auth}:HttpContextContract){
    await auth.user?.load('news')
    const news = auth.user?.news
    if(!news) return response.notFound({ msg: "you havent news" })
    return {
      msg:"news got",
      data: news
    }
  }
  public async store({request, response}: HttpContextContract){
    try{
      const data = await request.validate(UserValidator)

      const createdUser = new User()
      createdUser.fill({ ...data,email: data.email.toLowerCase() })
      await createdUser.related('roles').attach(data.roles)

      await createdUser.save()
      return response.created({
        msg:"the user were created",
        data: createdUser.toJSON()
      })
    } catch(err){
      return response.badRequest(err)
    }
  }
}
