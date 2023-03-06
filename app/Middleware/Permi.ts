import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Permi {
  public async handle({request,response}: HttpContextContract, next: () => Promise<void>) {
    console.log(request.method())
    console.log(request.url())
    await next()
  }
}
