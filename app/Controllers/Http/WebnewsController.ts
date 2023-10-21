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

      queryNews.where(query).where({disabled:0}).preload('writer',(q)=>{q.select(['name','last_name'])}).preload('sections')

      if (orderBy) {
        queryNews.orderBy( order === 'desc' ? '-' + orderBy : orderBy)
      }
      if (query.slug) {
    
        
      }
      const results = await queryNews.paginate(page|| 1, limit || 12)
      return response.ok(results)
    } catch(err){
      console.log('error at new_controller->bySeciton',err)
      return response.status(err.status || 400).send(err)
    }
  }
	public async fiveResent() {
    const news = await News.query().where({}).orderBy('created_at','desc').paginate(1,6)
    return news
  }

  public async mostViews() {
    const news = await News.query().where('visits').orderBy('visits').paginate(1,5)
    return news
  }
  public async show() {

  }

  public async getTitulares(){
    const date = new Date()
    const titulares = (await News.query().where('create_at',date).orderBy('created_at','asc').paginate(1,10))
    return titulares
  }
}
