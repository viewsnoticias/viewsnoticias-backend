import { Request } from '@adonisjs/core/build/standalone'
import Route from '@ioc:Adonis/Core/Route'

const hideForWriter = (hide)=> async (ctx,next)=>{
  if (!!ctx.auth.user?.writer === hide){
    return ctx.response.notFound('route not found')
  }
  await next()
}
Route.get('/', async () => {
  return { data:"tkm ❤❤❤" }
})

Route.group(()=>{
  //S
  //writer routes
  Route.group(()=>{
    Route.resource('/writer/news','Writer/NewsController')
    Route.put('/writer/profile','Writer/WriterController.update')
    Route.put('/writer/password','Writer/WriterController.passwordUpdate')
    Route.get('/writer/profile', 'Writer/WriterController.show')
    Route.put('/writer/profile/avatar','Writer/WriterController.loadAvatarProfile')
  }).middleware('Auth').middleware(hideForWriter(false))

  Route.post('/auth/login','AuthController.login')
  Route.post('/auth/witers','AuthController.authWriter')
  Route.post('/auth/forgot','AuthController.forgot')
  Route.post('/auth/check','AuthController.check')
  Route.get('/files','FilesController.show')

  //rutas para web
  Route.group(() => {
    Route.get('/web/news','WebnewsController.index')
    Route.get('/web/news/mostrecent','WebnewsController.mostRecent')
    Route.get('/web/news/mostvisited','WebnewsController.mostVisited')
    Route.get('/web/news/:slug','WebnewsController.show')
    Route.get('/web/sections','SectionsController.index')
    Route.get('/web/news/writer/:writer','WebnewsController.moreFromAuthor')
    Route.get('/web/sections/:id','SectionsController.show')
    Route.get('/web/titulares','WebnewsController.getTitulares')
  })

  //rutas para el admin
  Route.group(()=>{
    Route.get('/news','AdminNewsController.index')
    Route.get('/news/:id','AdminNewsController.show')
    Route.put('/news/:id','AdminNewsController.status')
    Route.resource('/writers','AdminWritersController').apiOnly() //.except(['update']).apiOnly()
    Route.resource('/sections','SectionsController').apiOnly()
    Route.resource('/users','UsersController').apiOnly()
    Route.resource('/roles','RolesController').apiOnly()
    //Route.get('/user/profile','AuthController.profile')
  })
  .middleware('Auth')
  .middleware(hideForWriter(true))
  .middleware('Permi')
  //permissions
  Route.get('/user/profile','AuthController.profile')
  .middleware('Auth')
  .middleware(hideForWriter(true))
}).prefix('api')
