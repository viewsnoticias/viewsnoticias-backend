import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Section from 'App/Models/Section'
import SectionValidator from 'App/Validators/SectionValidator'

export default class SectionsController {
  public async index({ response }){
    const sections = await Section.all()
    return response.ok({
      msg:"sections got",
      data: sections
    })
  }
  public async update({ params, request }){
    const section = await Section.findOrFail(params.id)
    await section.update(request.body())
    return { msg: 'section updated' }
  }
  public async destroy({ params }){
    const section = await Section.findOrFail(params.id)
    await section.delete()
    return { msg: 'section deleted' }
  }
  public async show({ params }){
    const section = await Section.findOrFail(params.id)
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
