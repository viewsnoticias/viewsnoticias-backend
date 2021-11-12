import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import News from "App/Models/News";
import NewsValidator from "App/Validators/NewsValidator";
import Application from "@ioc:Adonis/Core/Application";
import { readFileSync } from 'fs'
import User from 'App/Models/User';
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
    await news.update(request.body())
    return { msg: 'news updated' }
  }
  public async destroy({ params }){
    const news = await News.findOrFail(params.id)
    await news.delete()
    return { msg: 'news deleted' }
  }
  public async show({ params }){
    const news = await News.findOrFail(params.id)
    await news.load('sections')
    await news.load('user')
    const sections = news.sections.map(section => section.name )
    const body = readFileSync(Application.makePath(news!.body)).toString()
    return {
      msg: 'news got',
      data: {
        ...news.toJSON(),
        body,
        sections
      }
    }
  }
  public async store({request, response}: HttpContextContract){
    try{
      const data = await request.validate(NewsValidator)
      const user = await User.findOrFail(data.user)
      await data.body.move(user.repository())
      const createdNews = await News.create({
        ...data,
        body: user.repository() + data.body.clientName,
      })
      await createdNews.related('sections').attach(data.sections)
      await createdNews.related('user').associate(user)

      return response.created({
        msg:"the news were created",
        data: createdNews.toJSON()
      })
    } catch(err){
      console.log(err)
      return response.badRequest(err)
    }
  }
}
