import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class RoleSeeder extends BaseSeeder {
  public async run () {
    await Role.createMany([
      {
        name: 'Administrador',
        permissions: { '*': '' }
      },
      {
        name: 'Escritor',
        permissions: {
          'GET':['my-news','my-news/:id','sections'],
          'PUT':['my-news/:id'],
          'POST':['my-news'],
          'DELETE':['my-news/:id'], 
        }
      },
      {
        name: 'Administrador de Noticias',
        permissions: {
          'GET':['news','news/:id','sections','sections/:id'],
          'PUT':['news/:id'],
          'PUT':['news/:id/status'], 
        }
      }
    ])
  }
}
