import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class RoleSeeder extends BaseSeeder {
  public async run () {
    await Role.createMany([
      {
        name: 'Administrador',
        permissions: { '*': ['*'] }
      },
      {
        name: 'Administrador de Escritores',
        permissions: { 'writers': ['GET','POST','DELETE'] }
      },
      {
        name: 'Administrador de Usuarios',
        permissions: { 
          'users': ['GET','POST','DELETE','PUT'] 
        }
      },
      {
        name: 'Administrador de Noticias',
        permissions: {
          'news':['GET','PUT'],
        }
      }
    ])
  }
}
