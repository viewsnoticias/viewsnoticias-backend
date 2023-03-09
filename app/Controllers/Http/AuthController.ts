import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database"
import User from "App/Models/User"

export default class AuthController {
  public async login({ request, response, auth }){
    const body = request.body()
    if (!body.email || !body.password){
      return response.badRequest({msg:"required data were not provided"})
    }
    const user = await User.findByOrFail('email',body.email)
    try{
      const passwordVerify = await user.verifyPassword(body.password)
      if (!passwordVerify){
        return response.badRequest({ msg: "password incorrect" })
      }
      await Database
            .from('api_tokens')
            .where('user_id',user.id)
            .delete()
      const token = await auth.use('api').generate(user)
      return {
        data: { token: token.token },
        msg:"logged succefully"
      }
    } catch(err){
      return response.badRequest(err)
    }
  }
  public async profile({ auth }){
    return { data: auth.user }
  }
  public async check({ auth, response }:HttpContextContract){
    if (!(await auth.use('api').check())){
      return response.unauthorized({msg:"unautorized"})
    }
    return response.ok({msg:"authorized"})
  }
}
