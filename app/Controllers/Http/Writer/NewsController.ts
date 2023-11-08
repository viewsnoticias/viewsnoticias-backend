import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import News from "App/Models/News";
import NewsValidator from "App/Validators/NewsValidator";
import {uploadFile,destroitFile}  from "../../../../helpers/uploadFile";



export default class NewsController {
  public async index({ request, response, auth }: HttpContextContract) {
    let { orderBy, order, query, page, limit } = request.qs();
    query = JSON.parse(query || "{}");
    if(!auth.user) return response.notFound({msg:'Un Athorize'})
    const queryNews = auth.user.related("news").query();
    if (query.section_id !== undefined) {
      queryNews.whereHas("sections", (subQuery) => {
        subQuery.where("section_id", query.section_id);
      });
      delete query["section_id"];
    }
    queryNews.where(query);
    queryNews.where({ disabled: 0 });
    queryNews.preload("writer");
    queryNews.preload("sections");
    if (orderBy) {
      queryNews.orderBy(order === "desc" ? "-" + orderBy : orderBy);
    }
    const results = await queryNews.paginate(page || 1, limit || 10);
    return response.ok(results);
  }

  public async update({ request, response, auth, params }:HttpContextContract) {
    const body = request.body();
    const header = request.file("header");
    
    if(!auth.user) return response.notFound('Usuario no Autenticado')
    try {
      const news = await News.query()
                  .where({ id: params.id, user_id: auth.user.id })
                  .first();

      if ( !news ) return response.notFound({ msg: "Noticia no encontrada" });
      
      if (header) {
        destroitFile(news.header)
        const urlFile = await uploadFile(header.tmpPath) 
        body.header = urlFile
        //await header.move(Application.publicPath());
      } else {
        body.header = news.header
      }
      //todo adicionrar o quitar noticias
      if (!body.sections) return response.notFound({ msg: "Las secciones son requeridas" });
      news.related("sections").sync(body.sections);

      await news.update(body);
      return { msg: "news updated", newsId: news.id };

    } catch (err) {
      console.log(err);
      return response.internalServerError(err);
    }
  }

  public async destroy({ params, response}:HttpContextContract) {
  
    const { id } = params;
    if (!id) return response.notFound({ msg: "news not found" });
    const news = await News.query().where({ id: params.id }).first();
    if (!news) {
      return response.notFound({ msg: "news not found" });
    }
    news.disabled = 1;
    await news.save();
    return { msg: "Noticia eliminada" };
  }

  public async show({ params, response, auth }:HttpContextContract) {
    if(!auth.user)return response.unauthorized({msg:'Unauthorize'})
    const news = await News.query()
      .where({ id: params.id, user_id: auth.user.id })
      .first();
    if (!news) {
      return response.notFound({ msg: "noticia no encontrada" });
    }
    await news.load("sections", (query) => {
      query.select("name");
    });
    await news.load("writer");
    return {
      msg: "news got",
      data: news,
    };
  }

    public async store({ request, response, auth }: HttpContextContract) {
      if(!auth.user)return response.unauthorized({msg:'Unauthorize'})
    try {
      const data = await request.validate(NewsValidator);
      if(!data.header){
        return response.badRequest({msg:'Es requerida una imagen'})
      }
      const urlFile = await uploadFile(data.header.tmpPath)      
      //almacenamiento local solo desarrollo pruebas
      // await data.header.move(Application.publicPath());
      // console.log("data",data.header)

      const createdNews = await News.create({
        ...data,
        header: urlFile, //en desarrollo
      });
      createdNews.related("sections").attach(data.sections);
      createdNews.related("writer").associate(auth.user);
      createdNews.save();
      return response.created({
        msg: "The new Post Is created",
        data: createdNews.toJSON(),
      });
    } catch (err) {
      console.log(err);
      return response.badRequest(err);
    }
  }
}
