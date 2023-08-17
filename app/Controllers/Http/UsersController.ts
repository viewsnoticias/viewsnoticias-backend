import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import News from 'App/Models/News'
import User from "App/Models/User"
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public async index({ response, request }){
    let { orderBy, order, query, page, limit } = request.qs()
    query = JSON.parse(query || "{}")

    try{
      const queryUser = User.queryUsers() 

      if (query.role_id!==undefined){
        queryUser.whereHas('roles',(subQuery)=>{
          subQuery.where('user_id',query.role_id)
        })
        delete query['role_id']
      }
      
      queryUser.where(query)
      queryUser.where({disabled:0})
      queryUser.preload('roles')
      

      if (orderBy) {
        queryUser.orderBy( order === 'desc' ? '-' + orderBy : orderBy)
      }

      const results = await queryUser.paginate(page || 1, limit || 10)
      return response.ok(results)
      
    } catch(err){
      console.log('error at new_controller->index',err)
      return response.status(err.status || 400).send(err)
    }
  }
  public async update({ params, request, response }){

    try {
      const body = request.body()
      const user = await User.queryUsers().where({ id: params.id }).first()
     
      if(!user) {
        return response.notFound({msg:"user not found"})
      }
      if (body.roles){
        await user.related('roles').detach()
        await user.related('roles').attach(body.roles)
      }
      console.log(body.status)
      await user.update(body)
      return { msg: 'user updated', userId: user.id,status: user.status }
    } catch(err) {
      console.log('USER->update',err)
      return response.badRequest(err)
    }
  }
  public async destroy({ params, response }){
    const user = await User.queryUsers().where({ id:params.id }).first()
    if(!user) {
      return response.notFound({msg:"user not found"})
    }
    user.disabled = 1
    await user.save()
    return { msg: 'user deleted' }
  }
  public async show({ params, response }){
    const user = await User.queryUsers()
      .where({ id:params.id })
      .preload('roles')
      .first()
    if(!user) {
      return response.notFound({msg:"user not found"})
    }

    return {
      msg: 'user got',
      data: user
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
