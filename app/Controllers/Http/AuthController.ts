import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database"
import User from "App/Models/User"

export default class AuthController {
  
  public async login({ request, response, auth }:HttpContextContract){
    
    const {email,password} = request.body()
    const status = ['verificado','pendiente','negado']
    if (!email || password){
      return response.badRequest({msg:"Todos los campos son requeridos"})
    }
    const user = await User.findByOrFail('email',email)
    if(user.status !== 0) {
      return response.badRequest({msg: `acount status in ${status[user.status]}`})
    }
    if(user.writer !== 0){
      return response.badRequest({msg: 'Usuario no es administrador'})
    }
    try{
      const passwordVerify = await user.verifyPassword(password)
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
      return response.internalServerError(err)
    }
  }

  public async authWriter({ request, response, auth }:HttpContextContract){
    const {email,password} = request.body();
    const status = ['verificado','pendiente','negado']
    if(!email || !password){
      return response.notFound({msg:'Todos Los Campos Son Requeridos'});
    }
    try{
      const user = await User.find('email',email)
      if(!user){
        return response.notFound({msg:'Verifique el email'})
      }
      if(user.status !== 0) {
        return response.badRequest({msg: `Estado dela cuenta: ${status[user.status]}`})
      }
      const passwordVerify = await user.verifyPassword(password)
      if(!passwordVerify){
        return response.badRequest({msg:'Contraseña Incorrecta'})
      }
      await Database
            .from('api_tokens')
            .where('user_id',user.id)
            .delete()

      const token = await auth.use('api').generate(user)

      return {
        data: { token: token.token },
        msg:"Usuario Autenticado"
      }
    }catch(err){
      return response.internalServerError(err)
    }
  }

  public async profile({ auth }){
    await auth.user?.load('roles')
    return { data: auth.user }
  }

  public async check({ auth, response }:HttpContextContract){
    if (!(await auth.use('api').check())){
      return response.unauthorized({msg:"unautorized"})
    }
    return response.ok({msg:"authorized"})
  }

}
