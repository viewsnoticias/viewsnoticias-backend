import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WriterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string(
      { trim:true },
      [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]
    ),
    name: schema.string(),
    last_name: schema.string(),
    password: schema.string(
      { trim:true },
      [
        rules.minLength(8)
      ]
    )
  })
  public messages = {}
}
