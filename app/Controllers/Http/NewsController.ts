import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import News from "App/Models/News";
import NewsValidator from "App/Validators/NewsValidator";
export default class NewsController {
  public async index({ response }){
    const newsList = await News.query().preload('user').preload('sections')
    const newsJSON = newsList.map((news)=> {
      const sections = news.sections.map(section => section.name )
      return { ...news.toJSON(), sections }
    })
    return response.ok({
      msg:"news got",
      data: newsJSON
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
    return {
      msg: 'news got',
      data: {
        ...news.toJSON(),
        sections
      }
    }
  }
  public async store({request, response, auth}: HttpContextContract){
    try{
      if (!auth.user){
        return response.badRequest({msg:"usuario no lodeado"})
      }
      const data = await request.validate(NewsValidator)
      const createdNews = await News.create(data)
      await createdNews.related('sections').attach(data.sections)
      await createdNews.related('user').associate(auth.user)

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
