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
      if (query.role_id!==undefined){
        queryWriter.whereHas('roles',(subQuery)=>{
          subQuery.where('user_id',query.role_id)
        })
        delete query['role_id']
      }
      
      queryWriter.where(query)
      queryWriter.preload('roles')

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
  public async update({ params, request, response }){
    try {
      const body = request.body()
      const writer = await User.queryWriters().where({ id: params.id }).first()
      if(!writer) {
        return response.notFound({msg:"writer not found"})
      }
      await writer.update(body)
      return { msg: 'writer updated', writerId: writer.id }
    } catch(err) {
      console.log('writer->update',err)
      return response.badRequest(err)
    }
  }
  public async show({ params, response }, news: News){
    const writer = await User.queryWriters().where({ id:params.id }).first()
    if(!writer) {
      return response.notFound({msg:"writer not found"})
    }
    await news.load('sections',(q)=>{q.select('name')})
    await news.load('writer')
    return {
      msg: 'news got',
      data: news
    }
  }
  public async show({ params, response }){
    const writer = await User.queryWriters().where({ id:params.id }).first()
    if(!writer) {
      return response.notFound({msg:"writer not found"})
    }
    await writer.load('roles')
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
        email: varifiedData.email.toLowerCase() 
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
