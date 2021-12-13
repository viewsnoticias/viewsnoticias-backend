import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from "@ioc:Adonis/Core/Application"
export default class FilesController {
  public async show({ response, request }: HttpContextContract){
    const file = Application.publicPath(request.input('fileName'))
    return response.download(file)
  }
}
