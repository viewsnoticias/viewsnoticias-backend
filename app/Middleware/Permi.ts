import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Permi {
  public async handle({ request,response, auth }: HttpContextContract, next: () => Promise<void>) {
    const method = request.method()
    const parsedPath = request.url().split('/api/')[1]
    const user= auth.user
    if(!user) return 
    await user.load('roles')

    
    for (let role of user.roles){
      role.permissions = JSON.parse(role.permissions.toString())
      if(Object(role.permissions).hasOwnProperty('*') && role.permissions['*'][0]==='*'){
        break
      }
      const permissions = role.permissions[parsedPath]

      if ( !permissions){
        return response.unauthorized({ msg: "you have not permissions" })
      }
      
      console.log({role})

      const havePermission = permissions.includes(method)

      
      if (!havePermission){
        return response.unauthorized({ msg: "you have not permissions" })
      }
    }
    await next()
  }
}
