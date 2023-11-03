import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Section from 'App/Models/Section'
import SectionValidator from 'App/Validators/SectionValidator'
import { bind } from '@adonisjs/route-model-binding'

export default class SectionsController {
  public async index({ }){
    const sections = await Section.all()
    return {
      msg:"sections got",
      data: sections
    }
  }
  @bind()
  public async update({ request }, section: Section){
    await section.update(request.body())
    return { msg: 'section updated' }
  }
  @bind()
  public async destroy({},section: Section){
    await section.delete()
    return { msg: 'section deleted' }
  }
  @bind()
  public async show({}, section: Section){
    return {
      msg: 'section got',
      data: section.toJSON()
    }
  }
  public async store({request, response}: HttpContextContract){
    try{
      const data = await request.validate(SectionValidator)

      const createdSection = new Section()
      createdSection.fill({ ...data })
      await createdSection.save()
      return response.created({
        msg:"the section were created",
        data: createdSection.toJSON()
      })
    } catch(err){
      return response.badRequest(err)
    }
  }
}
