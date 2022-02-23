import Application from '@ioc:Adonis/Core/Application';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import News from "App/Models/News";
import NewsValidator from "App/Validators/NewsValidator";
export default class NewsController {
  public async index({ response, request }:HttpContextContract){
    const querys = request.qs()
    let {orderBy, order,query, page, limit } = querys
    let results: any = null

    if (orderBy){
      results = await News.query()
        .where(JSON.parse(query || "{}"))
        .preload('user')
        .preload('sections')
        .orderBy(orderBy,order)
        .paginate(page|| 1, limit || 10)
    } else{

      results = await News.query()
        .where(JSON.parse(query || "{}"))
        .preload('user')
        .preload('sections')
        .paginate(page|| 1, limit || 10)
    }

    const newsList = results.all()
    const newsJSON = newsList.map((news)=> {
      const sections = news.sections.map(section => section.name )
      return { ...news.toJSON(), sections }
    })
    return response.ok({
      msg:"news got",
      data: newsJSON
    })
  }
  public async fiveResent() {
    const news = await News.query().where({}).orderBy('createdAt').paginate(1,5)
    return {
      msg:'news resents',
      data: news
    }
  }
  public async update({ params, request }){
    const news = await News.findOrFail(params.id)
    const body = request.body()
    const header = request.file('header')
    if (header){
      await header.move(Application.publicPath())
    }
    await news.update({...body,header: header.fileName})
    await news.related('sections').sync(body.sections)
    return { msg: 'news updated' }
  }
  public async destroy({ params }){
    const news = await News.findOrFail(params.id)
    await news.delete()
    return { msg: 'news deleted' }
  }
  public async show({ params, request }){
    const { host:requestHost } = request.headers()
    console.log(requestHost)
    const news = await News.findOrFail(params.id)
    await news.load('sections')
    await news.load('user')
    const sections = news.sections.map(section => section.name )
    if(
      requestHost !== 'admin.viewsnoticias.com' ||
      requestHost !== 'localhost:8081' ||
      requestHost !== 'localhost:3333' ||
      requestHost !== 'api.viewsnoticias.com'){
      await news.update({visits: news.visits + 1 })
    }
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
      await data.header.move(Application.publicPath())
      const createdNews = await News.create({
        ...data,
        header:data.header.fileName
      })
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
