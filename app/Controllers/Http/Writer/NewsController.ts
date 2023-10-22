import Application from "@ioc:Adonis/Core/Application";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import News from "App/Models/News";
import NewsValidator from "App/Validators/NewsValidator";

export default class NewsController {
  public async index({ request, response, auth }: HttpContextContract) {
    let { orderBy, order, query, page, limit } = request.qs();
    query = JSON.parse(query || "{}");
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
    return results;
  }

  public async update({ request, response, auth, params }) {
    const body = request.body();
    const data = body;
    const header = request.file("header");
    try {
      const news = await News.query()
        .where({ id: params.id, user_id: auth.user.id })
        .first();
      if (!news) {
        return response.notFound({ msg: "noticia no encontrada" });
      }
      if (!body.sections)
        return response.notFound({ msg: "Las secciones son requeridas" });
      if (header) {
        data.header = header.fileName;
      }

      if (header) {
        await header.move(Application.publicPath());
      }

      news.related("sections").sync(body.sections);
      await news.update(data);
      return { msg: "news updated", newsId: news.id };
    } catch (err) {
      console.log(err);
      return response.badRequest(err);
    }
  }
  public async destroy({ params, response, auth }) {
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

  public async show({ params, request, response, auth }) {
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
    try {
      const data = await request.validate(NewsValidator);
      await data.header.move(Application.publicPath());
      console.log(Application.publicPath("example.jpg"));
      const createdNews = await News.create({
        ...data,
        header: data.header.fileName, //en desarrollo
      });
      createdNews.related("sections").attach(data.sections);
      createdNews.related("writer").associate(auth.user);
      createdNews.save();
      return response.created({
        msg: "the news were created",
        data: createdNews.toJSON(),
      });
    } catch (err) {
      console.log(err);
      return response.badRequest(err);
    }
  }
}
