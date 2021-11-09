import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class NewsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    header: schema.string(),
    title: schema.string(),
    body: schema.file(),
    writer: schema.string()
  })
  public messages = {}
}
