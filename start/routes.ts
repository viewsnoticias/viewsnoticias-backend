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
  //writer routes
  Route.group(()=>{
    Route.resource('/writer/news','Writer/NewsController')
    Route.put('/writer/profile','Writer/WriterController.update')
    Route.get('/writer/profile','Writer/WriterController.show')
  
  }).middleware('Auth').middleware(hideForWriter(false))

  Route.post('/auth/login','AuthController.login')
  Route.post('/auth/check','AuthController.check')
  Route.get('/files','FilesController.show')
  //rutas para web
  Route.group(() => {
    Route.get('/web/news','WebnewsController.index')
    Route.get('/web/news/currents','WebnewsController.fiveResent')
    Route.get('/web/news/most-views','WebnewsController.mostViews')
    Route.get('/web/news/:id','WebnewsController.show')
    Route.get('/web/sections','SectionsController.index')
    Route.get('/web/sections/:id','SectionsController.show')
  })
  //rutas para el admin
  
  Route.group(()=>{
    Route.get('/news','AdminNewsController.index')
    Route.get('/news/:id','AdminNewsController.show')
    Route.get('/news/:id/status','AdminNewsController.status')
    Route.resource('/writers','AdminWritersController').except(['update']).apiOnly()
    Route.resource('/sections','SectionsController').apiOnly()
    Route.resource('/users','UsersController').apiOnly()
    Route.resource('/roles','RolesController').apiOnly()
    Route.get('/user/profile','AuthController.profile')
  })
  .middleware('Auth')
  .middleware(hideForWriter(true))
  .middleware('Permi')
  //permissions

}).prefix('api')