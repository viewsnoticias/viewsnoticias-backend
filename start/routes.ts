import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('api/v1/auth/login','AuthController.login')

Route.group(()=>{
  Route.resource('/news','NewsController').except(['edit','create'])
  Route.resource('/sections','SectionsController').except(['edit','create'])
  Route.resource('/users','UsersController').except(['edit','create'])
  Route.get('/my-news/:id','UsersController.myNews')
  Route.resource('/roles','RolesController').except(['edit','create'])
}).prefix('api/v1').middleware('Auth')
