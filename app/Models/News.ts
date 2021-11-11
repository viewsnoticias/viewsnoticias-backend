import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Section from './Section'
import User from './User'

export default class News extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public header: string

  @column()
  public body: string

  @hasMany(()=> User)
  public writer: HasMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany( () => Section, { pivotTable: 'news_sections' })
  public sections: ManyToMany<typeof Section>

  public async update(data){
    Object.keys(data).forEach( (key) => {
      this[key] = data[key]
    })
    return this.save()
  }
}
