import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Response } from "@adonisjs/core/build/standalone";
import News from "App/Models/News";

export default class WebnewsController {
  public async index({ request, response }: HttpContextContract) {
    let { orderBy, order, query, page, limit } = request.qs();

    query = JSON.parse(query || "{}");
    try {
      const queryNews = News.query();

      if (query.section_id !== undefined) {
        queryNews.whereHas("sections", (q) => {
          q.where("id", query.section_id);
        });
        delete query["section_id"];
      }

      queryNews
        .where(query)
        .where({ disabled: 0 })
        .preload("writer", (q) => {
          q.select(["name", "last_name"]);
        })
        .preload("sections");

      if (orderBy) {
        queryNews.orderBy(order === "desc" ? "-" + orderBy : orderBy);
      }
      if (query.slug) {
      }
      const results = await queryNews.paginate(page || 1, limit || 12);
      return response.ok(results);
    } catch (err) {
      console.log("error at new_controller->bySeciton", err);
      return response.status(err.status || 400).send(err);
    }
  }
  public async mostRecent({response}) {
    try{
      const news = await News.query()
                   .where({ disabled: 0 })
                   .orderBy("created_at", "desc")
                   .paginate(1, 6)
    return response.ok(news)

    }catch(err){
      console.log('ocurrdio un error contacte con el administrador'+ err)
      return response.internalServerError(err)
    }
    
  }
  //get a news mostVisits 
  public async mostVisited({response}:HttpContextContract) {
    try {
      const news = await News.query()
                   .where({ disabled: 0 })
                   .preload("writer",(q) => {q.select(["name", "last_name"]);})
                   .preload("sections")
                   .orderBy("visits")
                   .paginate(1, 5);

      if(news.length <= 0) response.ok({msg:'No hay noticias cargadas'})
      return response.ok(news);
    }catch(err){
      console.log('ocurrio un erro contacte con su administrador ',err)
      return response.internalServerError(err)
    }    
  }
  //get news by author of news five 
  public async moreFromAuthor({response,request}:HttpContextContract){
    //todo obtener cinco noticias del autor al cual se hace referencia 
    // por mas visitados ordenados por fehca
    const {writer} = request.params()
    if(!writer) return response.badRequest({msg:'writer is required'})
    const news = News.query()
                .where({ disabled: 0 })
                .preload("writer", (q) => {q.select(["name", "last_name"])})
                .preload("sections")
        
    console.log('mas del autor controlador ')
    console.log(news)
    return news
  }

  //get a news by id
  public async show({ request, response }:HttpContextContract) {
    const { slug } = request.params();
    try {
      if(!slug) return response.badRequest({msg:'el paramtro slud is requerido'});

      const news = await News.query()
                   .where({slug:slug})
                   .where({ disabled: 0 })
                   .preload("writer", (q) => {q.select(["name", "last_name"])})
                   .preload("sections")
                   .first(); 

      if(!news) return response.badRequest({msg:'No se encontro noticia con  '+ slug});
      news.visits +=1;
      news.save();
      return news;
    } catch (error) {
      console.log('Error inesperado contacte con el administrador'+error)
      return response.status(500)
    }
  }

  public async getTitulares({response}:HttpContextContract) {
    const date = Date.now();
    const titulares = await News.query()
      .where("create_at", date)
      .orderBy("created_at", "asc")
      .preload("writer", (q) => {q.select(["name", "last_name"]);})
      .preload("sections")
      .paginate(1, 10);
    return response.ok(titulares);
  }
}
