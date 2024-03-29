import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor () {
    super(Logger)
  }
  public async handle(error: any, ctx: HttpContextContract){
    //manejador de error; no encontrado
    if (error.code === 'E_ROUTE_NOT_FOUND'){
      return ctx.response.notFound({ msg: 'route not found' })
    }
    if (error.code === 'E_ROW_NOT_FOUND' ){
      return ctx.response.notFound({ msg: 'not found in db' })
    }
    return super.handle(error,ctx)
  }
}
