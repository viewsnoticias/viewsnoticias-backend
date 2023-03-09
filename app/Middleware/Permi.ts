import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Permi {
  public async handle({ request,response, auth }: HttpContextContract, next: () => Promise<void>) {
    const method = request.method()
    const parsedPath = request.url().split('/api/')[1]
    const user= auth.user
    await user.load('roles')

    for (const role of user.roles){
      const permissions = JSON.parse(role.permissions)[parsedPath]
      const havePermission = permissions?.includes(method)
      if(role.permissions['*']==='*'){
        return next()
      }
      if ( !permissions  || !havePermission){
        return response.unauthorized({ msg: "you have not permissions" })
      }
    }
    await next()
  }
}
