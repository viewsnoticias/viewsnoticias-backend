import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateNoticias extends BaseSchema {
  protected tableName = 'news'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.string('header').notNullable()
      table.string('body').notNullable()
      table.string('writer').notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
