import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class NewsSections extends BaseSchema {
  protected tableName = 'news_sections'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('news_id').unsigned().references('news.id')
      table.integer('section_id').unsigned().references('sections.id')
      table.unique(['news_id','section_id'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
