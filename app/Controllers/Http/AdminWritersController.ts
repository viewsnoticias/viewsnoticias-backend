import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import News from 'App/Models/News'
import User from "App/Models/User"
import UserValidator from 'App/Validators/UserValidator'

export default class WritersController {
  public async index({ response, request }){
    let { orderBy, order, query, page, limit } = request.qs()
    query = JSON.parse(query || "{}")

    try{
      const queryWriter = User.queryWriters()  
      queryWriter.where(query)
      if (orderBy) {
        queryWriter.orderBy( order === 'desc' ? '-' + orderBy : orderBy)
      }
      const results = await queryWriter.paginate(page|| 1, limit || 10)
      return response.ok(results)
    } catch(err){
      console.log('error at new_controller->index',err)
      return response.status(err.status || 400).send(err)
    }
  }
  public async show({ params, response }){
    const writer = await User.queryWriters().where({ id:params.id }).first()
    if(!writer) {
      return response.notFound({msg:"writer not found"})
    }
    return {
      msg: 'writer got',
      data: writer
    }
  }
  public async destroy({ params, response }){
    const writer = await User.queryWriters().where({ id:params.id }).first()
    if(!writer) {
      return response.notFound({msg:"writer not found"})
    }
    writer.disabled = 1
    await writer.save()
    return { msg: 'writer deleted' }
  }
  public async store({ request, response }: HttpContextContract){
    try{
      const varifiedData = await request.validate(UserValidator)

      const createdwriter = new User()
      createdwriter.fill({ 
        ...data,
        email: varifiedData.email.toLowerCase(),
        writer:1
      })
      await createdwriter.save()
      return response.created({
        msg:"the writer were created",
        data: createdwriter.toJSON()
      })
    } catch(err){
      console.log('writer-STORE',err)
      return response.badRequest(err)
    }
  }
}
