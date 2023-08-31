
export default class WriterController {
  public async passwordUpdate({ auth, request, response }){
    try {
      const writer = auth.user
      const {newPassword,currentPassword} = request.body()
      if(!writer ) return response.notFound({msg:"writer not found"})
      const passwordVerify = await writer.verifyPassword(currentPassword);
      if(!passwordVerify) return response.badRequest({msg:"current password invalid"})
      await writer.update({password:newPassword})
      return { msg: 'Password updated', writerId: writer.email }
    } catch(err) {
      console.log('writer->update',err)
      return response.badRequest(err)
    }
  }
  public async update({ auth, request, response }){
    try {
      const writer = auth.user
      const body = request.body()
      if(!writer) return response.notFound({msg:"writer not found"})
      await writer.update(body)
  
      return { msg: 'writer updated', writerId: writer.id }
    } catch(err) {
      console.log('writer->update',err)
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
