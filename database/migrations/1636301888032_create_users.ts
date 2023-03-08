import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name')
      table.string('last_name')
      table.string('email').unique()
      table.string('password')
      table.integer('writer').defaultTo(0)
      table.integer('disabled').defaultTo(0)
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
