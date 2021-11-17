import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class NewsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    header: schema.string(),
    title: schema.string(),
    body: schema.string(),
    sections: schema.array().members(
      schema.number([
        rules.exists({
          table:'sections',
          column:'id'
        })
      ])
    )
  })
  public messages = {}
}
