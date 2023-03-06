import Application from '@ioc:Adonis/Core/Application';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import News from "App/Models/News";
import NewsValidator from "App/Validators/NewsValidator";
export default class NewsController {
  public async status({response,request}){}
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
}
