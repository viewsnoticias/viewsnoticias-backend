import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('api/v1/auth/login','AuthController.login')
Route.post('api/v1/auth/check','AuthController.check')


//rutas para obtener noticias y secciones
Route.group(()=> {
  Route.get('/news','NewsController.index')
  Route.get('/news/:id','NewsController.show')
  Route.get('/sections','SectionsController.index')
  Route.get('/sections/:id','SectionsController.show')
}).prefix('api/v1')
//grupo de rutas de la api (backend)
Route.group(()=>{
  Route.resource('/news','NewsController').except(['edit','create','show','index'])
  Route.resource('/sections','SectionsController').except(['edit','create','show','index'])
  Route.resource('/users','UsersController').except(['edit','create'])
  Route.get('/my-news/:id','UsersController.myNews')
  Route.resource('/roles','RolesController').except(['edit','create'])
  Route.get('/user/profile','AuthController.profile')
}).prefix('api/v1').middleware('Auth')
