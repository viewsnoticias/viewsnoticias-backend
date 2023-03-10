import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'visits_stats'
  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('news_id')
            .unsigned()
            .references('news.id')
            .onDelete('CASCADE')
      table.datetime('date')
      table.integer('visits')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
