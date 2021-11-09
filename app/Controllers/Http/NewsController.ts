import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import News from "App/Models/News";
import NewsValidator from "App/Validators/NewsValidator";
import Application from "@ioc:Adonis/Core/Application";
import { readFileSync } from 'fs'
export default class NewsController {
  public async index({ response }){
    const news = await News.all()
    return response.ok({
      msg:"news got",
      data: news
    })
  }
  public async
  public async destroy({ params, response }){
    const news = await News.find(params.id)
    await news?.delete()
    return response.ok({msg:"news deleted"})
  }
  public async show({ params, response }){
    const news = await News.find(params.id)
    if (!news){
      return response.notFound({msg:"news were not found"})
    }
    const body = readFileSync(Application.makePath(news.body)).toString()
    return response.ok({
      msg:"news got",
      data: {...news.toJSON(),body}
    })
  }
  public async store({request, response}: HttpContextContract){
    try{
      const data = await request.validate(NewsValidator)
      const fileFolder = Math.random().toString(32)
      const bodyPath = `media/contenido/${data.writer}/${fileFolder}/`
      await data.body.move(Application.makePath(bodyPath))
      const createdNew = new News()
      createdNew.header = data.header
      createdNew.title = data.title
      createdNew.body = bodyPath + data.body.clientName
      createdNew.writer = data.writer
      await createdNew.save()
      return response.created({
        msg:"the news were created",
        data: createdNew.toJSON()
      })
    } catch(err){
      console.log(err)
      return response.badRequest(err)
    }
  }
}
