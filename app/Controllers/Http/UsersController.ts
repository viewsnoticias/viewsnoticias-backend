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
  public async allMyNews({ response, auth}:HttpContextContract){
    await auth.user?.load('news')
    const news = auth.user?.news
    if(!news) return response.notFound({ msg: "you havent news" })
    return {
      msg:"news got",
      data: news
    }
  }
  public async myNews({ response, auth, params}:HttpContextContract){
    const user = auth.user
    const userNews = await News
                            .query()
                            .where({id: params.id, user_id: user?.id })
                            .first()
    await userNews?.load('sections')
    if(!userNews) return response.notFound({ msg: "you havent news" })
    return {
      msg:"news got",
      data: userNews,
    }
  }
  public async store({request, response}: HttpContextContract){
    try{
      const data = await request.validate(UserValidator)
      const roles = data.roles 
      delete data.roles
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
