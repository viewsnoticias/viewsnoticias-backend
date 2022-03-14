import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany
} from '@ioc:Adonis/Lucid/Orm'
import Section from './Section'
import User from './User'

export default class News extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public title: string

  @column()
  public header: string

  @column()
  public body: string

  @column()
  public visits: number

  @column({ serialize:(value) => ['verificado','pendiente','negado'][value] })
  public status: number

  @belongsTo(()=> User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Section,{ pivotTable: 'news_sections'})
  public sections: ManyToMany<typeof Section>

  public async update(data){
    Object.keys(data).forEach( (key) => {
      if (key !== 'user' && key !== 'userId') this[key] = data[key]
    })
    return this.save()
  }
}
