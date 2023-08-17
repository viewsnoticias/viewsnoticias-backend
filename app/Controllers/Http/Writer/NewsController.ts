import Application from '@ioc:Adonis/Core/Application';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import News from "App/Models/News";
import Section from "App/Models/Section";
import NewsValidator from "App/Validators/NewsValidator";
import {status} from 'App/Services/NewsService'


export default class NewsController {

  public async index({request, response, auth }:HttpContextContract){
    let { orderBy, order, query, page, limit } = request.qs()
    query = JSON.parse(query || "{}")
    const queryNews = auth.user.related('news').query()
    
    if (query.section_id!==undefined){
        queryNews.whereHas('sections',(subQuery)=>{
          subQuery.where('section_id',query.section_id)
        })      
        delete query['section_id']
    }
    
    queryNews.where(query)
    queryNews.preload('writer')
    queryNews.preload('sections')

    if (orderBy) {
      queryNews.orderBy( order === 'desc' ? '-' + orderBy : orderBy)
    }

    const results = await queryNews.paginate(page|| 1, limit || 10)
    return results
  }

  public async update({ request, response, auth, params }){
    const body = request.body()
    const data = body
    const header = request.file('header')
    try{
      const news = await News.query().where({id:params.id,user_id:auth.user.id}).first()
      if (!news){
        return response.notFound({msg:"noticia no encontrada"})
      }
      if(header) {
        data.header = header.fileName
      }

      if (header){
        await header.move(Application.publicPath())
      }

      await news.update(data)
      news.related('sections').sync(body.sections)
      return { msg: 'news updated', newsId: news.id }

    }catch(err){
      console.log(err)
      return response.badRequest(err)
    }
  }
  public async destroy({ auth }){
    const news = await News.query().where({id:params.id,user_id:auth.user.id}).first()
    if (!news){
      return response.notFound({msg:"noticia no encontrada"})
    }
    await news.softDelete()
    return { msg: 'news deleted' }
  }

  public async show({ params, request, auth }){
    const news = await News.query().where({id:params.id,user_id:auth.user.id}).first()
    if (!news){
      return response.notFound({msg:"noticia no encontrada"})
    }
    await news.load('sections',(query)=>{query.select('name')})
    await news.load('writer')
    return {
      msg: 'news got',
      data: news
    }
  }
  public async store({request, response,auth}: HttpContextContract){
    try{
      const data = await request.validate(NewsValidator)
      await data.header.move(Application.publicPath())
      const createdNews = await News.create({
        ...data,
        header:data.header.fileName,
      })
      createdNews.related('sections').attach(data.sections)
      createdNews.related('writer').associate(auth.user)
      createdNews.save()
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
