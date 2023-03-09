import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import News from 'App/Models/News'
import User from "App/Models/User"
import WriterValidator from 'App/Validators/WriterValidator'

export default class WriterController {
  public async update({ auth, request, response }){
    try {
      const writer = auth.user
      const body = request.body()
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
  public async show({ auth }){
    const writer = auth.user
    return {
      msg: 'writer got',
      data: writer
    }
  }
}
