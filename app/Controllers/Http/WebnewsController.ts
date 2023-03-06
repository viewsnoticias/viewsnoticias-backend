// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import News from 'App/Models/News'

export default class WebnewsController {

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
	public async fiveResent() {
    const news = await News.query().where({}).orderBy('createdAt').paginate(1,5)
    return {
      msg:'news resents',
      data: news
    }
  }
  public async mostViews() {
    const news = await News.query().where({}).orderBy('visits').paginate(1,5)
    return {
      msg:'news most visited',
      data: news
    }
  }
}
