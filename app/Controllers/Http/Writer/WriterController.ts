import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import News from 'App/Models/News'
import User from "App/Models/User"
import WriterValidator from 'App/Validators/WriterValidator'

export default class WritersController {
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
  public async show({ params, response, auth }){
    const writer = auth.user
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
}
