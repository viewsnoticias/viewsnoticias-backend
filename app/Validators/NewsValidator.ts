import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class NewsValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    header: schema.file({
      extnames:['gif','png','jpg','jpeg','webp']
    }),
    title: schema.string(),
    body: schema.string(),
    titular:schema.string(),
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
