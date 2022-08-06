import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { data:"tkm ❤❤❤" }
})

Route.post('api/v1/auth/login','AuthController.login')
Route.post('api/v1/auth/check','AuthController.check')


//rutas para obtener noticias y secciones
Route.group(()=> {
  Route.get('/news','NewsController.index')
  Route.get('/news/currents','NewsController.fiveResent')
  Route.get('/news/most-views','NewsController.mostViews')
  Route.get('/news/:id','NewsController.show')
  Route.get('/files','FilesController.show')
  Route.get('/sections','SectionsController.index')
  Route.get('/sections/:id','SectionsController.show')
}).prefix('api/v1')
//grupo de rutas de la api (backend)
Route.group(()=>{
  Route.resource('/news','NewsController').except(['edit','create','show','index'])
  Route.resource('/sections','SectionsController').except(['edit','create','show','index'])
  Route.resource('/users','UsersController').except(['edit','create'])
  Route.get('/my-news','UsersController.allMyNews')
  Route.get('/my-news/:id','UsersController.myNews')
  Route.resource('/roles','RolesController').except(['edit','create'])
  Route.get('/user/profile','AuthController.profile')
}).prefix('api/v1')
  .middleware('Auth')
