import Application from '@ioc:Adonis/Core/Application';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import News from "App/Models/News";
import NewsValidator from "App/Validators/NewsValidator";
import { bind } from '@adonisjs/route-model-binding'

export default class NewsController {

  public async index({request, response }:HttpContextContract){
    let { orderBy, order, query, page, limit } = request.qs()
    query = JSON.parse(query || "{}")
    try{
      const queryNews = News.query()
      if (query.section_id!==undefined){
        queryNews.whereHas('sections',(q)=>{
          q.where('id',query.section_id)
        })
        delete query['section_id']
      }
      queryNews.where(query).load('writer').load('sections')
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
  @bind()
  public async status({ request }, news: News){
    news.status = request.status
    await news.update()
    return { msg: "news status changed" }
  }
  @bind()
  public async show({ }, news: News){
    await news.load('sections',(q)=>{q.select('name')})
    await news.load('writer')
    return {
      msg: 'news got',
      data: news
    }
  }
}
