import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateNoticias extends BaseSchema {
  protected tableName = 'news'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title').notNullable()
      table.string('header').notNullable()
      table.text('body').notNullable()
      table.integer('user_id')
            .unsigned()
            .references('users.id')
            .onDelete('CASCADE')
      table.integer('visits').defaultTo(0)
      //0 = verificado
      //1 = pendiente
      //2 = negado
      table.integer('status').defaultTo(1)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
