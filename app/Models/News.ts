import { DateTime } from 'luxon'
import {
  BaseModel,
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

  @column({ serializeAs: null })
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
  public writer: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public deletedAt: DateTime

  @manyToMany(() => Section,{ pivotTable: 'news_sections'})
  public sections: ManyToMany<typeof Section>

  public async update(data){
    Object.keys(data).forEach( (key) => {
      if (key !== 'user' && key !== 'userId') this[key] = data[key]
    })
    return this.save()
  }
  public of(user: number | User){
    if (typeof user === typeof User){
      return this.query().where({ user_id: user.id })
    }
    return this.query().where({ user_id: id })
  }
  public async softDelete(){
    this.deletedAt = Date.now()
    this.deleted = 1
    this.save()
  }
}
