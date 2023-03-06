import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { data:"tkm ❤❤❤" }
})

Route.group(()=>{

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
    Route.resource('/writer/news','Writer/NewsController').apiOnly()

    Route.get('/news','AdminNewsController.index')
    Route.get('/news/id','AdminNewsController.show')
    Route.get('/news/id/status','AdminNewsController.status')

    Route.resource('/sections','SectionsController').apiOnly()
    Route.resource('/users','UsersController').apiOnly()

    Route.get('/my-news','UsersController.allMyNews')
    Route.get('/my-news/:id','UsersController.myNews')
    
    Route.resource('/roles','RolesController').apiOnly()
    
    Route.get('/user/profile','AuthController.profile')
  })
  .middleware('Permi')
  //.middleware('Auth')
  //permissions

}).prefix('api')