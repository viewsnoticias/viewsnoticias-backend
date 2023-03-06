import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserAdminSeeder extends BaseSeeder {
  public async run () {
    const u1 = await User.create(
      {
        name: 'admin',
        lastName: 'admin',
        email:'admin@admin.com',
        password:'12345678',
        status:0
      }
    )
    const u2 = await User.create(
    {
        name: 'writer',
        lastName: 'writer',
        email:'writer@writer.com',
        password:'12345678',
        status:0
      }
    )
    const u3 = await User.create(
      {
        name: 'admin',
        lastName: 'news',
        email:'admin@news.com',
        password:'12345678',
        status:0
      }
    )
    await u1.related('roles').attach([1])
    await u2.related('roles').attach([2])
    await u3.related('roles').attach([3])
  }
}
