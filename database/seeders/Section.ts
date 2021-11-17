import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Section from 'App/Models/Section'

export default class SectionSeeder extends BaseSeeder {
  public async run () {
    await Section.createMany(
      [
        {
          name:"internacionales"
        },
        {
          name:"politica"
        },
        {
          name:"deportes"
        },
        {
          name:"carabobo"
        },
      ]
    )
  }
}
