// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import News from 'App/Models/News'

export default class WebnewsController {

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
      queryNews.where(query).load('writer',(q)=>{q.select(['name','last_name'])}).load('sections')
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
	public async fiveResent() {
    const news = await News.query().where({}).orderBy('createdAt').paginate(1,5)
    return news
  }
  public async mostViews() {
    const news = await News.query().where({}).orderBy('visits').paginate(1,5)
    return news
  }
}
