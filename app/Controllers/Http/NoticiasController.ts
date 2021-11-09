import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Noticia from "App/Models/Noticia";
import NoticiaValidator from "App/Validators/NoticiaValidator";
import Application from "@ioc:Adonis/Core/Application";

export default class NoticiasController {
  public async index({ response }){
    const noticias = await Noticia.all()
    return response.ok({
      msg:"news got",
      data: noticias
    })
  }
  public async show({ params, response }){
    const noticia = await Noticia.find(params.id)
    if (!noticia){
      return response.notFound({msg:"new were not found"})
    }
    return response.ok({
      msg:"news got",
      data: noticia.toJSON()
    })
  }
  public async store({request, response}: HttpContextContract){
    try{
      const data = await request.validate(NoticiaValidator)
      const fileFolder = Math.random().toString(32)
      const bodyPath = `media/contenido/${data.writer}/${fileFolder}/`
      await data.body.move(Application.makePath(bodyPath))
      const createdNew = new Noticia()
      createdNew.header = data.header
      createdNew.title = data.title
      createdNew.body = bodyPath + data.body.clientName
      createdNew.writer = data.writer
      await createdNew.save()
      return response.created({
        msg:"the new were created",
        data: createdNew.toJSON()
      })
    } catch(err){
      console.log(err)
      return response.badRequest(err)
    }
  }
}
