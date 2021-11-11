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
  public async update({ params, request }){
    const news = await News.findOrFail(params.id)

    news.update(request.body())
    await news.save()

    return { msg: 'news updated' }
  }
  public async destroy({ params }){
    const news = await News.findOrFail(params.id)
    await news.delete()
    return { msg: 'news deleted' }
  }
  public async show({ params }){
    const news = await News.findOrFail(params.id)
    const body = readFileSync(Application.makePath(news.body)).toString()
    return {
      msg: 'news got',
      data: {...news.toJSON(),body}
    }
  }
  public async store({request, response}: HttpContextContract){
    try{
      const data = await request.validate(NewsValidator)

      const fileFolder = Math.random().toString(32)
      const bodyPath = `media/contenido/${data.writer}/${fileFolder}/`
      await data.body.move(Application.makePath(bodyPath))

      const createdNew = new News()
      createdNew.fill({ ...data, body: bodyPath + data.body.clientName })
      await createdNew.save()
      return response.created({
        msg:"the news were created",
        data: createdNew.toJSON()
      })
    } catch(err){
      return response.badRequest(err)
    }
  }
}
