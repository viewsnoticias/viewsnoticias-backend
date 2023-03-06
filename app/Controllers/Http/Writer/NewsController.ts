import Application from '@ioc:Adonis/Core/Application';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import News from "App/Models/News";
import Section from "App/Models/Section";
import NewsValidator from "App/Validators/NewsValidator";
export default class NewsController {

  public async index({request, response }:HttpContextContract){
    let { orderBy, order, query, page, limit } = request.qs()
    query = JSON.parse(query || "{}")
    let sectionQuery:any = null
    try{
      const queryNews = News.query()
      if (query.section_id!==undefined){
        queryNews.has('sections','=',query.section_id)
        delete query['section_id']
      }
      queryNews.where(query).preload('user').preload('sections')
      queryNews.has('user','=',auth.user?.id)
      if (orderBy) {
        queryNews.orderBy( order === 'desc' ? '-' + orderBy : orderBy)
      }
      const results = await queryNews.paginate(page|| 1, limit || 10)

      return response.ok(results)
    } catch(err){
      console.log('error at new_controller->bySeciton',err)
      return response.status(err.status || 400).send(err)
    }

  }
  
  public async update({ params, request }){
    const news = await News.findOrFail(params.id)
    const body = request.body()
    const data = body
    const header = request.file('header')
    if(header) {
      data.header = header.fileName
    }
    if (header){
      await header.move(Application.publicPath())
    }
    await news.update(data)
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
      if (!auth.user) return response.badRequest({msg:"user not found"})
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
