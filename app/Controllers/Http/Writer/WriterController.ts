import Application from '@ioc:Adonis/Core/Application'
import { v4 as uuidv4 } from 'uuid';
export default class WriterController {

  public async passwordUpdate({ auth, request, response }){
    try {
      const writer = auth.user

      if(!writer) {
        return response.notFound({msg:"writer not found"})
      }
      
      const {newPassword,currentPassword} = request.body()
      if(!newPassword || !currentPassword) return response.badRequest({msg:'Todos los campos son requeridos'})
      
     

      const passwordVerify = await writer.verifyPassword(currentPassword);
      

      if(!passwordVerify) {
        return response.badRequest({msg:"La Contraseña es invalidad"})
      }
      await writer.update({password:newPassword})

      return { msg: 'Password updated', writerId: writer.email,passwordVerify,writer:writer.password }
    
    } catch(err) {
      console.log('writer->update',err)
      return response.badRequest(err)
    }
  }
  public async update({ auth, request, response }){
    try {
      const writer = auth.user
      const body = request.body()
      if(body.avatar) {
        await body.avatar.Application.publicPath()
      }
      if(!writer) return response.notFound({msg:"writer not found"})
      await writer.update(body)
      return { msg: 'writer updated', writer: {email:writer.email,avatar:writer.avatar} }
    } catch(err) {
      console.log('writer->update',err)
      return response.badRequest(err)
    }
  }

  public async loadAvatarProfile({auth,request,response}){
    try{
      const writer = auth.user

      if(!writer) return response.badRequest({msg:'unauthorize'})
      
      const coverImage = request.file('avatar',{
       extnames: ['jpg','png']
      })
      
      if (coverImage) {
        const name = 'avatar_'+uuidv4()
        coverImage.clientName=name.concat('.',coverImage.extname)
        await coverImage.move(Application.publicPath('avatars'))
      }
       if(!coverImage){
         return response.badRequest({smg: 'Debes cargar una imagen'})
       }

       if(!coverImage.isValid){
        return response.badRequest({smg:coverImage.errors})
       }
      
      writer.update({avatar:coverImage.fileName})
      return {msg:'Avatar Update',avatar:writer.avatar}
    }catch(err){
      console.log("writer update avatar profile",err)
      return response.badRequest(err)
    }
  }
  public async show({ auth }){
    const writer = auth.user
    return {
      msg: 'writer got',
      data: writer
    }
  }
}
