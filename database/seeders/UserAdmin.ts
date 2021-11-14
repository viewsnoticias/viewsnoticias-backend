import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserAdminSeeder extends BaseSeeder {
  public async run () {
    const user = await User.create({
      name: 'admin',
      lastName: 'admin',
      email:'admin@viewsnoticias.com',
      password:'12345678'
    })
    await user.related('roles').attach([1])

  }
}
